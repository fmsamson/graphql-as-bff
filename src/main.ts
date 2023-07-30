import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Callback, Context, Handler } from 'aws-lambda';
import serverlessExpress from '@vendia/serverless-express';
import { SSM } from 'aws-sdk';

let server: Handler;
let SKIP_SSM = process.env.SKIP_SSM;

export let bottleApiBaseEndpoint = 'http://localhost:4000/';
export let householdApiBaseEndpoint = 'http://localhost:4000/';
export let milkApiBaseEndpoint = 'http://localhost:4000/';

const ssm = new SSM({ region: 'us-east-1' });

async function lambdaBootstrap(): Promise<Handler> {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
    const expressApp = app.getHttpAdapter().getInstance();
    return serverlessExpress({ app: expressApp });
}

const configureEndpoint = async () => {
    if (!(SKIP_SSM || process.env.NODE_ENV === 'development')) {
        const getParameter = async (paramName: string) => {
            const result = await ssm.getParameter({ Name: paramName, WithDecryption: false }).promise();
            return result.Parameter.Value;
        }

        bottleApiBaseEndpoint = await getParameter('/bottle-api/base-url');
        householdApiBaseEndpoint = await getParameter('/household-api/base-url');
        milkApiBaseEndpoint = await getParameter('/milk-api/base-url');

        SKIP_SSM = '1';
    }
}

export const handler: Handler = async (
    event: any, 
    context: Context, 
    callback: Callback) => {
        context.callbackWaitsForEmptyEventLoop = false;
        server = server ?? await lambdaBootstrap();
        await configureEndpoint();
        return server(event, context, callback);
};
