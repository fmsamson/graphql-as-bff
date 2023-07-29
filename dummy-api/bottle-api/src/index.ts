import jsonServer from 'json-server';
import bottleApi from './db.json';
import { Callback, Context, Handler } from 'aws-lambda';
import serverlessExpress from '@vendia/serverless-express';

const server = jsonServer.create();
const router = jsonServer.router(bottleApi);
const middlewares = jsonServer.defaults();

let serverHandler: Handler;

const bootstrap = () => {
    server.use(middlewares);
    server.use(jsonServer.rewriter({
        '/api/:id': '/bottles/:id',
    }));
    server.use(router);

    return serverlessExpress({ app: server });
}

export const handler: Handler = (
    event: any, 
    context: Context, 
    callback: Callback) => {
        context.callbackWaitsForEmptyEventLoop = false;
        serverHandler = serverHandler ?? bootstrap();
        return serverHandler(event, context, callback);
};