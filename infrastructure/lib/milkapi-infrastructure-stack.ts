import * as cdk from 'aws-cdk-lib';
import { Code, FunctionUrlAuthType, Runtime, Function } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import path = require('path');

require('dotenv').config();

export class MilkApiInfrastructureStack extends cdk.Stack {
  lambdaUrl: any;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // normal Lambda declaration
    const lambdaHandler = new Function(this, 'MilkApiHandler', {
      code: Code.fromAsset(path.resolve(__dirname, '../../dummy-api/milk-api/build'), {
        exclude: ['node_modules'],
      }),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_18_X,
      memorySize: 512,
    });

    this.lambdaUrl = lambdaHandler.addFunctionUrl({ authType: FunctionUrlAuthType.NONE }).url;
  }
}
