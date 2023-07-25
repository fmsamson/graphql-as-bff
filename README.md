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
