#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { LambdaEdgeInfrastructureStack } from '../lib/lambdaedge-infrastructure-stack';
import 'dotenv/config';
import { BottleApiInfrastructureStack } from '../lib/bottleapi-infrastructure-stack';
import { HouseholdApiInfrastructureStack } from '../lib/householdapi-infrastructure-stack';
import { MilkApiInfrastructureStack } from '../lib/milkapi-infrastructure-stack';

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
});

const householdApi = new HouseholdApiInfrastructureStack(app, 'HouseholdApiInfrastructureStack', {
  env: ENVIRONMENT_BOTTLE_API,
});

const milkApi = new MilkApiInfrastructureStack(app, 'MilkApiInfrastructureStack', {
  env: ENVIRONMENT_BOTTLE_API,
});

new LambdaEdgeInfrastructureStack(app, 'LambdaEdgeInfrastructureStack', {
  env: ENVIRONMENT_LAMBDA_EDGE,
  bottleApiUrl: bottleApi.lambdaUrl,
  householdApiUrl: householdApi.lambdaUrl,
  milkApiApiUrl: milkApi.lambdaUrl,
  crossRegionReferences: true,
});