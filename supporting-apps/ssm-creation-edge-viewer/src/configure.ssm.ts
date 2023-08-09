import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { GetParametersCommand, PutParameterCommand, SSMClient } from '@aws-sdk/client-ssm';

let ssmCleanupQueueUrl = 'http://localhost:4000/';

const ssmMainClient = new SSMClient({ region: 'us-east-1' });
const ssmWithinClient = new SSMClient({});
const sqsClient = new SQSClient({ region: 'us-east-1' });

const paramNames = [
    '/graphql-as-bff/bottle-api/base-url',
    '/graphql-as-bff/household-api/base-url',
    '/graphql-as-bff/milk-api/base-url',
    '/graphql-as-bff/ssm-cleanup-queue/url'
];
const multiParams = {
    Names: paramNames,
    WithDecryption: false,
};

export const configureEndpoint = async () => {
    await getParameters(ssmWithinClient, async (parameters) => {
        const result = parameters.filter(entry => {
            const value = paramNames.find((name) => { return name === entry.Name });
            return value !== undefined && value !== null;
        });
        if (result.length !== paramNames.length) {
            await getParameters(ssmMainClient, createParameters);
        }
    });
    return null;
}

async function getParameters(ssmClient, additionalExecution) {
    const command = new GetParametersCommand(multiParams);
    await ssmClient.send(command).then(async ({ Parameters }) => {
        console.log(`Parameters (${Parameters.length}): ${Parameters}`);
        const cleanupQueueParam = Parameters.find((parameter) => { return parameter.Name === paramNames[3] });
        if (cleanupQueueParam) ssmCleanupQueueUrl = cleanupQueueParam.Value;
        await additionalExecution(Parameters);
    });
}

async function createParameters(parameters) {
    const paramNames = [];

    parameters.forEach(async parameter => {
        paramNames.push(parameter.Name);
        await createWithinRegion(parameter);
    });
    
    const queueMsg = {
        MessageBody: JSON.stringify({
            names: paramNames,
            region: process.env.AWS_REGION,
        }),
        QueueUrl: ssmCleanupQueueUrl,
    };
    await sqsClient.send(new SendMessageCommand(queueMsg));
}

async function createWithinRegion(parameter) {
    const input = {
        Name: parameter.Name,
        Value: parameter.Value,
        Type: 'String',
        Tier: 'Standard',
        Overwrite: true,
      };
    const command = new PutParameterCommand(input);
    await ssmWithinClient.send(command);
}
