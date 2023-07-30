#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { GraphqlAsBffInfrastructureStack } from '../lib/graphqlasbff-infrastructure-stack';
import 'dotenv/config';
import { BottleApiInfrastructureStack } from '../lib/bottleapi-infrastructure-stack';
import { HouseholdApiInfrastructureStack } from '../lib/householdapi-infrastructure-stack';
import { MilkApiInfrastructureStack } from '../lib/milkapi-infrastructure-stack';

require('dotenv').config();

const ENVIRONMENT_LAMBDA_EDGE = {
  account: process.env.AWS_ACCOUNT,
  region: process.env.AWS_LAMBDA_EDGE_REGION,
};
const ENVIRONMENT_MOCK_API = {
  account: process.env.AWS_ACCOUNT,
  region: process.env.AWS_MOCK_API_REGION,
};
const app = new cdk.App();

const bottleApi = new BottleApiInfrastructureStack(app, 'MockBottleApiInfrastructureStack', {
  env: ENVIRONMENT_MOCK_API,
});

const householdApi = new HouseholdApiInfrastructureStack(app, 'MockHouseholdApiInfrastructureStack', {
  env: ENVIRONMENT_MOCK_API,
});

const milkApi = new MilkApiInfrastructureStack(app, 'MockMilkApiInfrastructureStack', {
  env: ENVIRONMENT_MOCK_API,
});

new GraphqlAsBffInfrastructureStack(app, 'GraphqlAsBffInfrastructureStack', {
  env: ENVIRONMENT_LAMBDA_EDGE,
  bottleApiUrl: bottleApi.lambdaUrl,
  householdApiUrl: householdApi.lambdaUrl,
  milkApiApiUrl: milkApi.lambdaUrl,
  crossRegionReferences: true,
});