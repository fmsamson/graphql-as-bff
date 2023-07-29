import * as cdk from 'aws-cdk-lib';
import { OriginProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { Code, FunctionUrlAuthType, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import path = require('path');

require('dotenv').config();

interface LambdaEdgeProps extends cdk.StackProps {
  bottleApiUrl: string;
  householdApiUrl: string;
  milkApiApiUrl: string;
}

export class LambdaEdgeInfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: LambdaEdgeProps) {
    super(scope, id, props);

    // Lambda@Edge declaration
    const myFunc = new cdk.aws_cloudfront.experimental.EdgeFunction(this, 'EdgeLambdaHandler', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'main.handler',
      code: Code.fromAsset(path.resolve(__dirname, '../../dist'), {
        exclude: ['node_modules', '**/*.d.ts'],
      }),
      memorySize: 1024,
    });
    const lambdaEdgeUrlForOrigin = cdk.Fn.select(2, 
      cdk.Fn.split('/', myFunc.addFunctionUrl({ authType: FunctionUrlAuthType.NONE }).url));

    // Cloudfront cache policy declaration
    const cachePolicy = new cdk.aws_cloudfront.CachePolicy(this, 'CloudfrontCachPolicy', {
      headerBehavior: cdk.aws_cloudfront.CacheHeaderBehavior.allowList('authorization'),
      queryStringBehavior: cdk.aws_cloudfront.CacheQueryStringBehavior.all(),
      cookieBehavior: cdk.aws_cloudfront.CacheCookieBehavior.none(),
      minTtl: cdk.Duration.seconds(0),
      maxTtl: cdk.Duration.seconds(1),
      defaultTtl: cdk.Duration.seconds(0),
      enableAcceptEncodingGzip: true,
      enableAcceptEncodingBrotli: true,
    });
    
    // Cloudfront declaration
    new cdk.aws_cloudfront.Distribution(this, 'CloudfrontDistribution', {
      defaultBehavior: {
        origin: new cdk.aws_cloudfront_origins.HttpOrigin(lambdaEdgeUrlForOrigin, {
          protocolPolicy: OriginProtocolPolicy.HTTPS_ONLY,
          httpsPort: 443,
          readTimeout: cdk.Duration.seconds(30),
        }),
        viewerProtocolPolicy: cdk.aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cdk.aws_cloudfront.AllowedMethods.ALLOW_ALL,
        cachePolicy: cachePolicy,
        edgeLambdas: [
          {
            functionVersion: myFunc.currentVersion,
            eventType: cdk.aws_cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
          },
          {
            functionVersion: myFunc.currentVersion,
            eventType: cdk.aws_cloudfront.LambdaEdgeEventType.ORIGIN_RESPONSE,
          }
        ],
      },
    });

    // SSM declaration
    const bottleApiParam = new cdk.aws_ssm.StringParameter(this, 'SsmBottleApi', {
      parameterName: process.env.AWS_SSM_NAME_BOTTLE_API_LAMBDA_EDGE,
      stringValue: props?.bottleApiUrl,
      description: 'endpoint for Bottle API',
      tier: cdk.aws_ssm.ParameterTier.STANDARD,
      allowedPattern: '.*',
    });
    const householdApiParam = new cdk.aws_ssm.StringParameter(this, 'SsmHouseholdApi', {
      parameterName: process.env.AWS_SSM_NAME_HOUSEHOLD_API_LAMBDA_EDGE,
      stringValue: props?.householdApiUrl,
      description: 'endpoint for Household API',
      tier: cdk.aws_ssm.ParameterTier.STANDARD,
      allowedPattern: '.*',
    });
    const milkApiParam = new cdk.aws_ssm.StringParameter(this, 'SsmMilkApi', {
      parameterName: process.env.AWS_SSM_NAME_MILK_API_LAMBDA_EDGE,
      stringValue: props?.milkApiApiUrl,
      description: 'endpoint for Milk API',
      tier: cdk.aws_ssm.ParameterTier.STANDARD,
      allowedPattern: '.*',
    });
  }
}
