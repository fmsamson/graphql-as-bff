#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { LambdaEdgeInfrastructureStack } from '../lib/lambdaedge-infrastructure-stack';
import 'dotenv/config';
import { BottleApiInfrastructureStack } from '../lib/bottleapi-infrastructure-stack';

require('dotenv').config();

const ENVIRONMENT_LAMBDA_EDGE = {
  account: process.env.AWS_ACCOUNT,
  region: process.env.AWS_LAMBDA_EDGE_REGION,
};
const ENVIRONMENT_BOTTLE_API = {
  account: process.env.AWS_ACCOUNT,
  region: process.env.AWS_BOTTLE_API_REGION,
};
const app = new cdk.App();

const bottleApi = new BottleApiInfrastructureStack(app, 'BottleApiInfrastructureStack', {
  env: ENVIRONMENT_BOTTLE_API,
  crossRegionReferences: true,
});

new LambdaEdgeInfrastructureStack(app, 'LambdaEdgeInfrastructureStack', {
  env: ENVIRONMENT_LAMBDA_EDGE,
  bottleApiUrl: bottleApi.lambdaUrl,
  crossRegionReferences: true,
});