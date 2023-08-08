import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { GetParametersCommand, PutParameterCommand, SSMClient } from '@aws-sdk/client-ssm';

export let bottleApiBaseEndpoint = 'http://localhost:4000/';
export let householdApiBaseEndpoint = 'http://localhost:4000/';
export let milkApiBaseEndpoint = 'http://localhost:4000/';

let ssmCleanupQueueUrl = 'http://localhost:4000/';

let SKIP_SSM = process.env.SKIP_SSM;
let PATH_EXIST = false;

const ssmMainClient = new SSMClient({ region: 'us-east-1' });
const ssmWithinClient = new SSMClient({});
const sqsClient = new SQSClient({ region: "us-east-1" });

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
    if (!(SKIP_SSM || process.env.NODE_ENV === 'development')) {
        await getParameters(ssmWithinClient, (parameters) => {
            const result = parameters.filter(entry => {
                const value = paramNames.find((name) => { return name === entry.Name });
                return value !== undefined && value !== null;
            });
            if (result.length === paramNames.length) PATH_EXIST = true;
        });

        if (!PATH_EXIST) {
            await getParameters(ssmMainClient, createParameters);
        }

        SKIP_SSM = '1';
    }
}



async function getParameters(ssmClient, additionalExecution) {
    const command = new GetParametersCommand(multiParams);
    await ssmClient.send(command).then(({ Parameters }) => {
        console.log(`Parameters (${Parameters.length}): ${Parameters}`);
        Parameters.forEach(parameter => {
            assignParameter(parameter);
        });
        additionalExecution(Parameters);
    });
}

function assignParameter(parameter) {
    switch (parameter.Name) {
        case paramNames[0]: bottleApiBaseEndpoint = parameter.Value; break;
        case paramNames[1]: householdApiBaseEndpoint = parameter.Value; break;
        case paramNames[2]: milkApiBaseEndpoint = parameter.Value; break;
        case paramNames[3]: ssmCleanupQueueUrl = parameter.Value; break;
        default: break;
    }
}

async function createParameters(parameters) {
    parameters.forEach(async parameter => {
        const input = {
            Name: parameter.Name,
            Value: parameter.Value,
            Type: 'String',
            Tier: 'Standard',
            Overwrite: true,
          };
        const command = new PutParameterCommand(input);
        await ssmWithinClient.send(command);

        const queueMsg = {
            MessageBody: JSON.stringify({
                name: parameter.Name,
                region: process.env.AWS_REGION,
            }),
            QueueUrl: ssmCleanupQueueUrl,
        };
        await sqsClient.send(new SendMessageCommand(queueMsg));
    });
}
