#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DatabaseStack } from '../lib/database/database-stack';
import { AuthStack } from '../lib/auth/auth-stack';
import { LambdaStack } from '../lib/lambda/lambda-stack';
import { ApiStack } from '../lib/api/api-stack';

const app = new cdk.App();

// 스택 생성
const databaseStack = new DatabaseStack(app, 'TodoAppDatabaseStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

const authStack = new AuthStack(app, 'TodoAppAuthStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

const lambdaStack = new LambdaStack(app, 'TodoAppLambdaStack', databaseStack, authStack, {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

const apiStack = new ApiStack(app, 'TodoAppApiStack', lambdaStack, authStack, {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
