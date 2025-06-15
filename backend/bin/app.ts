#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ApiStack } from '../lib/api/api-stack';
import { AuthStack } from '../lib/auth/auth-stack';
import { DatabaseStack } from '../lib/database/database-stack';
import { LambdaStack } from '../lib/lambda/lambda-stack';

const app = new cdk.App();

// 스택 생성
const authStack = new AuthStack(app, 'TodoAuthStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});

const databaseStack = new DatabaseStack(app, 'TodoDatabaseStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});

const lambdaStack = new LambdaStack(app, 'TodoLambdaStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  userPool: authStack.userPool,
  todoTable: databaseStack.todoTable,
});

const apiStack = new ApiStack(app, 'TodoApiStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  userPool: authStack.userPool,
  todoTable: databaseStack.todoTable,
  lambdaFunctions: lambdaStack.functions,
}); 