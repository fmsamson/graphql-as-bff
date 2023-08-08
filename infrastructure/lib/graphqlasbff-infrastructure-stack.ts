import * as cdk from 'aws-cdk-lib';
import { OriginProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { Rule, Schedule } from 'aws-cdk-lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Code, FunctionUrlAuthType, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import path = require('path');

require('dotenv').config();

interface GraphqlAsBffProps extends cdk.StackProps {
  bottleApiUrl: string;
  householdApiUrl: string;
  milkApiApiUrl: string;
}

export class GraphqlAsBffInfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: GraphqlAsBffProps) {
    super(scope, id, props);

    // SSM Policy declaration
    const ssmPolicy = new PolicyStatement({
      actions: [
        'ssm:PutParameter',
        'ssm:GetParameters',
        'ssm:GetParameter',
        'ssm:DeleteParameter',
      ],
      resources: [ 
        `arn:aws:ssm:*:${props.env?.account}:parameter${process.env.AWS_SSM_NAME_BOTTLE_API_LAMBDA_EDGE}`, 
        `arn:aws:ssm:*:${props.env?.account}:parameter${process.env.AWS_SSM_NAME_HOUSEHOLD_API_LAMBDA_EDGE}`,
        `arn:aws:ssm:*:${props.env?.account}:parameter${process.env.AWS_SSM_NAME_MILK_API_LAMBDA_EDGE}`,
        `arn:aws:ssm:*:${props.env?.account}:parameter${process.env.AWS_SSM_NAME_SSM_CLEANUP_QUEUE_LAMBDA_EDGE}`,
      ],
    });

    // Lambda@Edge declaration
    const graphqlAsBff = new cdk.aws_cloudfront.experimental.EdgeFunction(this, 'GraphqlAsBffHandler', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'main.handler',
      code: Code.fromAsset(path.resolve(__dirname, '../../dist'), {
        exclude: ['node_modules', '**/*.d.ts'],
      }),
      memorySize: 1024,
    });
    const graphqlAsBffUrlForOrigin = cdk.Fn.select(2, 
      cdk.Fn.split('/', graphqlAsBff.addFunctionUrl({ authType: FunctionUrlAuthType.NONE }).url));
    graphqlAsBff.addToRolePolicy(ssmPolicy);

    // Cloudfront cache policy declaration
    const cachePolicy = new cdk.aws_cloudfront.CachePolicy(this, 'GraphqlAsBffCloudfrontCachPolicy', {
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
    new cdk.aws_cloudfront.Distribution(this, 'GraphqlAsBffCloudfrontDistribution', {
      defaultBehavior: {
        origin: new cdk.aws_cloudfront_origins.HttpOrigin(graphqlAsBffUrlForOrigin, {
          protocolPolicy: OriginProtocolPolicy.HTTPS_ONLY,
          httpsPort: 443,
          readTimeout: cdk.Duration.seconds(30),
        }),
        viewerProtocolPolicy: cdk.aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cdk.aws_cloudfront.AllowedMethods.ALLOW_ALL,
        cachePolicy: cachePolicy,
        edgeLambdas: [
          {
            functionVersion: graphqlAsBff.currentVersion,
            eventType: cdk.aws_cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
          }
        ],
      },
    });

    // SQS declaration
    const ssmCleanupDlq = new Queue(this, 'SsmCleanupDlq', {
      queueName: 'ssm-cleanup-dlq',
    });
    const ssmCleanupQueue = new Queue(this, 'SsmCleanupQueue', {
      queueName: 'ssm-cleanup',
      deadLetterQueue: {
        queue: ssmCleanupDlq,
        maxReceiveCount: 3,
      },
    });
    ssmCleanupQueue.grantSendMessages(graphqlAsBff);

    // SSM declaration
    new cdk.aws_ssm.StringParameter(this, 'SsmGraphqlAsBffBottleApi', {
      parameterName: process.env.AWS_SSM_NAME_BOTTLE_API_LAMBDA_EDGE,
      stringValue: props?.bottleApiUrl,
      description: 'endpoint for Bottle API',
      tier: cdk.aws_ssm.ParameterTier.STANDARD,
      allowedPattern: '.*',
    });
    new cdk.aws_ssm.StringParameter(this, 'SsmGraphqlAsBffHouseholdApi', {
      parameterName: process.env.AWS_SSM_NAME_HOUSEHOLD_API_LAMBDA_EDGE,
      stringValue: props?.householdApiUrl,
      description: 'endpoint for Household API',
      tier: cdk.aws_ssm.ParameterTier.STANDARD,
      allowedPattern: '.*',
    });
    new cdk.aws_ssm.StringParameter(this, 'SsmGraphqlAsBffMilkApi', {
      parameterName: process.env.AWS_SSM_NAME_MILK_API_LAMBDA_EDGE,
      stringValue: props?.milkApiApiUrl,
      description: 'endpoint for Milk API',
      tier: cdk.aws_ssm.ParameterTier.STANDARD,
      allowedPattern: '.*',
    });
    new cdk.aws_ssm.StringParameter(this, 'SsmGraphqlAsBffSsmCleanupQueue', {
      parameterName: process.env.AWS_SSM_NAME_SSM_CLEANUP_QUEUE_LAMBDA_EDGE,
      stringValue: ssmCleanupQueue.queueUrl,
      description: 'endpoint for SSM Cleanup Queue',
      tier: cdk.aws_ssm.ParameterTier.STANDARD,
      allowedPattern: '.*',
    });

    // Lambda for SSM Cleanup declaration
    const ssmCleanupHandler = new cdk.aws_lambda.Function(this, 'SsmCleanupHandler', {
      code: Code.fromAsset(path.resolve(__dirname, '../../supporting-apps/ssm-cleanup-lambda/build'), {
        exclude: ['node_modules'],
      }),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_18_X,
      memorySize: 512,
      timeout: cdk.Duration.seconds(30),
    });
    ssmCleanupQueue.grantConsumeMessages(ssmCleanupHandler);
    ssmCleanupHandler.addToRolePolicy(ssmPolicy);

    // EventBridge Scheduler declaration
    new Rule(this, 'SsmCleanupRule', {
      schedule: Schedule.cron({
        minute: '0',
        hour: '*/12',
      }),
      enabled: true,
      targets: [
        new LambdaFunction(ssmCleanupHandler),
      ],
    });
  }
}
