#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { InfrastructureStack } from '../lib/infrastructure-stack';

const ENVIRONMENT = {
  account: '547184582560',
  region: 'eu-west-1',
};

const app = new cdk.App();
new InfrastructureStack(app, 'InfrastructureStack', {
  env: ENVIRONMENT,
});