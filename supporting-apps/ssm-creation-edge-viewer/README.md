<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Lambda@Edge SSM Parameter Store Creator](#lambdaedge-ssm-parameter-store-creator)
  - [Creating a Project from Scratch](#creating-a-project-from-scratch)
  - [Installation](#installation)
  - [Running the app](#running-the-app)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Lambda@Edge SSM Parameter Store Creator
This is a sample Lambda@Edge for Viewer Request events.  
Once executed it will check if the all the Parameter Store from the list exist in the edge location.
If not, then it will create them within the region and publish a message to the SQS for the Parameter Stores created for deletion later.

## Creating a Project from Scratch
Create a new folder and name it to the project name you want.  
Then execute the following commands to initialize the project.

```bash
$ npm init -y

$ npm install --save-dev \
@types/node \
rimraf \
serverless \
serverless-offline-edge-lambda \
ts-loader \
ts-node \
typescript \
webpack \
webpack-cli

$ npm install aws-lambda
```

Then create a `tsconfig.json` file and copy the settings below:

```json
{
    "compilerOptions": {
     "module": "commonjs",
     "declaration": true,
     "removeComments": true,
     "emitDecoratorMetadata": true,
     "experimentalDecorators": true,
     "allowSyntheticDefaultImports": true,
     "target": "ES2021",
     "outDir": "./build",
     "baseUrl": "./",
     "incremental": true,
     "skipLibCheck": true,
     "strictNullChecks": false,
     "noImplicitAny": false,
     "strictBindCallApply": false,
     "forceConsistentCasingInFileNames": false,
     "noFallthroughCasesInSwitch": false,
     "esModuleInterop": true,
     "resolveJsonModule": true
    }
  }
```

Next, create a `webpack.config.js` to bundle the project accordingly with the following configuration:

```javascript
const path = require('path');

module.exports = {
  entry: './src/index.ts',
  target: 'node',
  mode: 'none',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /(node_modules)/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'index.js',
    path: path.join(__dirname, 'build'),
    libraryTarget: 'commonjs2',
  },
};
```

Now we are ready to create a `index.ts` file where it will be the starting point of your Lambda function.  
Create the file under `src` folder and have the following as a sample handler:

```typescript
import { Callback, Context, Handler } from 'aws-lambda';

export const handler: Handler = (event: any, context: Context, callback: Callback) => {
    console.log('Hello World');
    const request = event.Records[0].cf.request;
    callback(null, request);
};
```

What it does is, it will print `Hello World` whenever the lambda function is executed and forward the request back to cloudfront.

Lastly, create the `serverless.yml` configuration to be able to run the Lambda@Edge function location.  
Have the following as the configuration to set the Lambda Function as Lambda@Edge, and it will only be executed 
when the event type is `viewer-request` with a path `/some-pattern`:

```yml
service: serverless-lambda-edge-example

plugins: 
  - serverless-offline-edge-lambda

provider:
  name: aws
  runtime: nodejs18.x

functions:
  lambda:
    handler: build/index.handler
    lambdaAtEdge:
      distribution: 'WebsiteDistribution'
      eventType: 'viewer-request'
      pathPattern: '/some-pattern'

resources:
  Resources:
    WebsiteDistribution:
      Type: 'AWS::CloudFront::Distribution'
      Properties:
        DistributionConfig:
          DefaultCacheBehavior:
```

Additionally, add the following script to your `package.json` to be able to build the project with webpack and run it 
using serverless:

```json
{
  ...
  "scripts": {
    ...
    "build": "rimraf ./build && webpack",
    "start": "npm run build && npx serverless offline start"
  },
  ...
}
```

Now you are all set for your Lambda@Edge project to run locally using `serverless-offline-edge-lambda`!

## Installation
```bash
$ npm install
```

## Running the app
```bash
# development mode
$ npm run start
```

> **_TAKE NOTE:_** Make sure to set the region in your aws config `~/.aws/config` and an active AWS TOKEN in your environment that can 
access your AWS account.