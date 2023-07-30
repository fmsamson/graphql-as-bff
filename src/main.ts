import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Callback, Context, Handler } from 'aws-lambda';
import serverlessExpress from '@vendia/serverless-express';
import { SSM } from 'aws-sdk';
import { SSMClient, GetParametersCommand } from '@aws-sdk/client-ssm';

let server: Handler;
let SKIP_SSM = process.env.SKIP_SSM;

export let bottleApiBaseEndpoint = 'http://localhost:4000/';
export let householdApiBaseEndpoint = 'http://localhost:4000/';
export let milkApiBaseEndpoint = 'http://localhost:4000/';

const ssm = new SSM({ region: 'us-east-1' });
const ssmClient = new SSMClient({ region: 'us-east-1' });

async function lambdaBootstrap(): Promise<Handler> {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
    const expressApp = app.getHttpAdapter().getInstance();
    return serverlessExpress({ app: expressApp });
}

const configureEndpoint = async () => {
    if (!(SKIP_SSM || process.env.NODE_ENV === 'development')) {
        const multiParams = {
            Names: [ 
                '/graphql-as-bff/bottle-api/base-url', 
                '/graphql-as-bff/household-api/base-url', 
                '/graphql-as-bff/milk-api/base-url' 
            ],
            WithDecryption: false,
        };
        const command = new GetParametersCommand(multiParams);
        await ssmClient.send(command).then(({ Parameters }) => {
                Parameters.forEach(element => {
                    switch(element.Name) {
                        case '/graphql-as-bff/bottle-api/base-url': bottleApiBaseEndpoint = element.Value; break;
                        case '/graphql-as-bff/household-api/base-url': householdApiBaseEndpoint = element.Value; break;
                        case '/graphql-as-bff/milk-api/base-url': milkApiBaseEndpoint = element.Value; break;
                        default: break;
                    }
                });
            });

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
