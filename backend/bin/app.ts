#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const app = new cdk.App();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};
