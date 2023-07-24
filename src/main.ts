import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Callback, Context, Handler } from 'aws-lambda';
import serverlessExpress from '@vendia/serverless-express';

let server: Handler;

async function lambdaBootstrap(): Promise<Handler> {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
    const expressApp = app.getHttpAdapter().getInstance();
    return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
    event: any, 
    context: Context, 
    callback: Callback) => {
        context.callbackWaitsForEmptyEventLoop = false;
        server = server ?? await lambdaBootstrap();
        return server(event, context, callback);
};
