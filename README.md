<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Description](#description)
- [Pre-requisite](#pre-requisite)
  - [Setting-up Project from scratch](#setting-up-project-from-scratch)
  - [Setting-up the End-to-End Test](#setting-up-the-end-to-end-test)
  - [TDD with BDD](#tdd-with-bdd)
  - [Setting-up Mock API for development and testing](#setting-up-mock-api-for-development-and-testing)
- [Installation](#installation)
- [Running the app](#running-the-app)
- [Test](#test)
- [Support](#support)
- [Stay in touch](#stay-in-touch)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

Proof of Concept using GraphQL as Backend for Frontend. It uses [NestJS](https://github.com/nestjs/nest) framework TypeScript with GraphQL.
It also applies the code-first approach in creating GraphQL schema.

If you want to install and run this project as-it-is, go directly to `Installation` and `Running the app` section.
<br>

## Pre-requisite
### Setting-up Project from scratch
See [Setting-up Project from scratch](docs/SETUP_PROJECT_FROM_SCRATCH.md) page.

### Setting-up the End-to-End Test
See [Setting-up the End-to-End Test](docs/SETUP_TESTING_MODULE.md) page.

### TDD with BDD
See [TDD with BDD](docs/TDD_WITH_BDD.md) page.

### Setting-up Mock API for development and testing
See [Setting-up Mock API for development and testing](docs/SETUP_MOCK_API_FOR_DEV_AND_TEST.md) page.

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

## Installation

```bash
$ yarn install
```
<br>

## Running the app

```bash
# development watch mode with mock API
$ yarn run start:dev-with-mockApi

# production mode
$ yarn run start:prod
```
<br>

## Test

```bash
# unit tests
$ yarn run test

# e2e tests with mock API
$ yarn run test:e2e-with-mockApi

# test coverage
$ yarn run test:cov
```
<br>

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).
<br>

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)
<br>

## License

Nest is [MIT licensed](LICENSE).
