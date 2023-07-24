import * as cdk from 'aws-cdk-lib';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import path = require('path');

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

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
  }
}
