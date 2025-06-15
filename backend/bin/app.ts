#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AuthStack } from '../lib/auth/auth-stack';
import { DatabaseStack } from '../lib/database/database-stack';
import { LambdaStack } from '../lib/lambda/lambda-stack';
import { ApiStack } from '../lib/api/api-stack';

const app = new cdk.App();

// 환경 설정
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

// 스택 생성
const authStack = new AuthStack(app, 'TodoAuthStack', { env });
const databaseStack = new DatabaseStack(app, 'TodoDatabaseStack', { env });
const lambdaStack = new LambdaStack(app, 'TodoLambdaStack', {
  env,
  userPool: authStack.userPool,
  todoTable: databaseStack.todoTable,
});
const apiStack = new ApiStack(app, 'TodoApiStack', {
  env,
  userPool: authStack.userPool,
  todoLambda: lambdaStack.todoLambda,
}); 