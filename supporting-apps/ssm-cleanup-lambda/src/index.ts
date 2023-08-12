import { Callback, Context, Handler } from 'aws-lambda';
import { SQS } from '@aws-sdk/client-sqs';
import { GetParameterCommand, SSM } from '@aws-sdk/client-ssm';

const sqsClient = new SQS({});
const ssmClient = new SSM({});

export const handler: Handler = async (
    event: any, 
    context: Context, 
    callback: Callback) => {
        await ssmClient.getParameter({
            Name: '/graphql-as-bff/ssm-cleanup-queue/url',
            WithDecryption: false,
        }).then(async ({ Parameter }) => {
            let keepRetrieving = true;
            while (keepRetrieving) {
                let messages = undefined;
                await sqsClient.receiveMessage({
                    MaxNumberOfMessages: 10,
                    QueueUrl: Parameter.Value,
                    VisibilityTimeout: 5,
                }).then((value) => {
                    messages = value.Messages;
                });
                keepRetrieving = messages !== undefined && messages.length > 0;
                if (!keepRetrieving) break;
                
                messages.forEach( async message => {
                    const msgBody = JSON.parse(message.Body);
                    // make sure not to delete the source SSM Parameter Store
                    if (msgBody.region !== 'us-east-1') {
                        const ssmDeleteClient = new SSM({ region: msgBody.region });
                        msgBody.names.forEach(async name => {
                            try {
                                await ssmDeleteClient.deleteParameter({
                                    Name: name,
                                });
                            } catch(err) {
                                console.error(err);
                            }
                        });
                    }
                    try {
                        await sqsClient.deleteMessage({
                            QueueUrl: Parameter.Value,
                            ReceiptHandle: message.ReceiptHandle
                        });
                    } catch(err) {
                        console.error(err);
                    }
                });
            }
        });
        callback(null, event);
};