<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Serverless](#serverless)
  - [Initializing Infrastructure](#initializing-infrastructure)
  - [Bootstrapping your AWS account](#bootstrapping-your-aws-account)
  - [Create an AWS Lambda Resource](#create-an-aws-lambda-resource)
  - [Bundling your NestJS App to Serverless](#bundling-your-nestjs-app-to-serverless)
  - [Running NestJS App in Serverless Offline](#running-nestjs-app-in-serverless-offline)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## Serverless

### Initializing Infrastructure

Create a folder `infrastructure` and to that folder and execute the following commands to create an infrastructure project.

```bash
$ npm install -g aws-cdk
$ cdk init app --language typescript
```

Then the following files are created:

- `bin/infrastructure.ts` is the starting point of your infrastructure project where you will going to initialize your stack.
- `lib/infrastructure-stack.ts` contains the stack itself where you are going to declare the resources that you want in AWS.
- `test/infrastructure.test.ts` contains your unit tests for your infrastructure.

### Bootstrapping your AWS account

To be able to deploy your infrasture using `cdk deploy`, make sure to bootstrap your AWS environment.  Execute the following command.
```bash
$ cdk bootstrap aws://<your aws account id>/<your preferred region>
```

Make sure that you have exported a fresh copy of your administrator AWS ACCESS KEY ID and SECRET along with the SESSION TOKEN.  You only need to set this up once.

### Create an AWS Lambda Resource

In `lib/infrastructure-stack.ts` create an AWS Lambda resource by having the code inside the constructor.

```typescript
    const lambdaHandler = new Function(this, 'LambdaHandler', {
      code: Code.fromAsset(path.resolve(__dirname, '../../dist'), {
        exclude: ['node_modules'],
      }),
      handler: 'main.handler',
      runtime: Runtime.NODEJS_18_X,
      environment: {
        NODE_PATH: `$NODE_PATH:/opt`,
      },
    });
```

In `bin/infrastructure.ts`, instantiate the stack accordingly by having the following code.

```typescript
const ENVIRONMENT = {
  account: '<your AWS Account ID>',
  region: '<your preferred AWS region>',
};

const app = new cdk.App();
new InfrastructureStack(app, 'InfrastructureStack', {
  env: ENVIRONMENT,
});
```

Then execute `cdk synth` to generate files in `cdk.out`.  It should have the equivalent cloudformation template in json of your infrastructure. Also, make sure that you have exported a fresh copy of your AWS ACCESS KEY ID and SECRET along with the SESSION TOKEN.

Lastly, execute `cdk deploy` to deploy your infrastructure in AWS.

### Bundling your NestJS App to Serverless

Run the following command to install the necessary library for serverless to work into your NestJS App.

```bash
$ yarn add aws-lambda
$ yarn add @vendia/serverless-express
$ yarn add --dev @types/aws-lambda serverless-offline
```

Then update `main.ts` to declare the `handler` which will be the entry point for a serverless app.  Your `main.ts` will look like below.

```bash
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Callback, Context, Handler } from 'aws-lambda';
import serverlessExpress from '@vendia/serverless-express';

let server: Handler;

async function bootstrap() {
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
        server = server ?? await bootstrap();
        return server(event, context, callback);
};
```

Next, add a `webpack.config.js` with the following content.

```typescript
module.exports = (options, webpack) => {
    const lazyImports = [
        '@nestjs/microservices/microservices-module',
        '@nestjs/websockets/socket-module',
        '@as-integrations/fastify',
        '@apollo/subgraph',
        '@apollo/gateway',
        '@apollo/subgraph/package.json',
        '@apollo/subgraph/dist/directives',
        'class-transformer/storage',
        'ts-morph'
    ];

    return {
        ...options,
        externals: [
            { fsevents: "require('fsevents')" }
        ],
        output: {
            ...options.output,
            libraryTarget: 'commonjs2',
        },
        plugins:[
            ...options.plugins,
            new webpack.IgnorePlugin({
                checkResource(resource) {
                    if(lazyImports.includes(resource)) {
                        try {
                            require.resolve(resource);
                        } catch(err) {
                            return true;
                        }
                    }
                    return false;
                }
            }),
        ],
    };
};
```

Lastly, update `tsconfig.json` to include `"esModuleInterop": true` for the webpack to work properly.  Also, exclude the `infrastructure` directory when build is run by adding it in `tsconfig.build.json`.

To build your NestJS using webpack is to add an option `--webpack` in your `package.json` under `build` script.  Then execute `yarn run build`.

### Running NestJS App in Serverless Offline

You will need to have `serverless.yml` for your NestJS App to run serverless locally.  Create the `serverless.yml` and copy the content below to it.

```yml
service: serverless-example

plugins: 
  - serverless-offline

provider:
  name: aws
  runtime: nodejs14.x

functions:
  main:
    handler: dist/main.handler
    events:
      - http:
          method: ANY
          path: /
      - http:
          method: ANY
          path: '{proxy+}'
```

Then run `npx serverless offline` to run your NestJS App as serverless in your local machine.