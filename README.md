<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Description](#description)
- [Pre-requisite](#pre-requisite)
  - [Setting-up Project from scratch](#setting-up-project-from-scratch)
  - [Setting-up the End-to-End Test](#setting-up-the-end-to-end-test)
  - [TDD with BDD](#tdd-with-bdd)
  - [Setting-up Mock API for development and testing](#setting-up-mock-api-for-development-and-testing)
- [Serverless](#serverless)
- [Minify](#minify)
- [Improving performance of GraphQL Lambda function](#improving-performance-of-graphql-lambda-function)
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

See [Serverless](docs/SERVERLESS.md) page.

## Minify

`yarn add -D terser-webpack-plugin`

```javascript
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
        new TerserPlugin({
            terserOptions: {
                keep_classnames: true,
                keep_fnames: true,
                compress: {
                    drop_console: true,
                },
                format: {
                    comments: false,
                },
            },
            extractComments: false,
        }),
    ],
  },
};
```

Adding the minify configuration has a significant decrease of `main.js` file size.  This will improve the performance of transferring the file to the runtime environment which contribute to `cold start` in serverless environment.  From `1.9 MB` down to `1,004.0 kB` package size and memory used is only `~118 MB`!

> Another thing is, the **Lambda Layer** is **NOT NEEDED** anymore. 
> So you can remove it from the lambda function setup!

## Improving performance of GraphQL Lambda function

- Automatic Persisted Query
  - Use /GET method in sending query to GraphQL
  - Persist the query with its equivalent sha256hash code in the server side
    - when the query does not yet exist, client sends the full query using POST
    - succeeding queries will retrieve it from the cache
  - By default, the persisted query are saved on in-memory cache
    - NOTE: better to save queries in a database as lambda function does not last longer and tend to have concurrent instances
- Lambda@Edge (at Regional Edge Location)
  - use for origin request and response event
  - SSM access to specific region to be able to locate the API to call
    - `yarn add serverless-offline-ssm -D`
    - optimize ssm parameter retrieval by only doing it once per lambda instance
    - batch retrieval helps improve the response of the lambda function especially with cold start
      - `yarn add @aws-sdk/client-ssm`
      - cold start ~500ms, ssm retrieval ~1.5s
    - SSM Cleanup
      - cannot use expiration option for SSM param as this is under "Advanced" tier which is not free
      - instead have a queue to every SSM Parameter created in edge location
        - `yarn add @aws-sdk/client-sqs`
      - there will be a scheduled lambda function running at the main region to read the queue and do the deletion
        - this is to make sure that there will be no unnecessary SSM Param left behind in edge location
        - also when an update is made on the SSM Param from main region, there will be a chance to update the existing SSM 
        - less manual management to these SSM params created in the edge regions
      - the schedule will be triggered by EventBridge
  - for GraphQL APQ with persistence layer, this is not possible as it requires VPC connection like Redis which is one of the limitation of Lambda@Edge
    - the only way is to call the persistence layer publicly to get the stored queries, so it can be available in its own memory in lambda replicas 
    - `yarn add keyv @apollo/utils.keyvadapter` to make use of customizable cache
      - TODO: retrieve queries from S3


## Installation

```bash
$ yarn install
```
<br>

## Running the app

```bash
# development mode with mock API
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
# Note: a command 'export NODE_ENV=development' is in the script 
# which works for mac/linux environment but not sure with windows 
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
