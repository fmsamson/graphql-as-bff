import { Callback, Context, Handler } from 'aws-lambda';
import { configureEndpoint } from './configure.ssm';

export const handler: Handler = (event: any, context: Context, callback: Callback) => {
    configureEndpoint();
    const request = event.Records[0].cf.request;
    callback(null, request);
};