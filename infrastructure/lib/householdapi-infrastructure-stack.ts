import * as cdk from 'aws-cdk-lib';
import { Code, FunctionUrlAuthType, Runtime, Function } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import path = require('path');

require('dotenv').config();

export class HouseholdApiInfrastructureStack extends cdk.Stack {
  lambdaUrl: any;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // normal Lambda declaration
    const lambdaHandler = new Function(this, 'HouseholdApiHandler', {
      code: Code.fromAsset(path.resolve(__dirname, '../../dummy-api/household-api/build'), {
        exclude: ['node_modules'],
      }),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_18_X,
      memorySize: 512,
    });

    this.lambdaUrl = cdk.Fn.select(2, 
      cdk.Fn.split('/', lambdaHandler.addFunctionUrl({ authType: FunctionUrlAuthType.NONE }).url));    
  }
}
