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
            await sqsClient.receiveMessage({
                MaxNumberOfMessages: 10,
                QueueUrl: Parameter.Value,
                VisibilityTimeout: 1,
                WaitTimeSeconds: 0
            }, (error, data) => {
                data.Messages.forEach( async message => {
                    const msgBody = JSON.parse(message.Body);
                    
                    const ssmDeleteClient = new SSM({ region: msgBody.region });
                    try {
                        await ssmDeleteClient.deleteParameter({
                            Name: msgBody.name,
                        });
                    } catch(err) {
                        console.error(err);
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
            }); 
        });
        callback(null, event);
};