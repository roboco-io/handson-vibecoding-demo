import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { DatabaseStack } from '../database/database-stack';
import { AuthStack } from '../auth/auth-stack';

export class LambdaStack extends cdk.Stack {
  public readonly todoLambda: lambda.Function;
  public readonly userLambda: lambda.Function;

  constructor(
    scope: Construct,
    id: string,
    databaseStack: DatabaseStack,
    authStack: AuthStack,
    props?: cdk.StackProps,
  ) {
    super(scope, id, props);

    // Lambda 함수를 위한 IAM 역할 생성
    const lambdaRole = new iam.Role(this, 'TodoAppLambdaRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
      ],
    });

    // DynamoDB 테이블에 대한 접근 권한 추가
    databaseStack.todoTable.grantReadWriteData(lambdaRole);
    databaseStack.userTable.grantReadWriteData(lambdaRole);

    // Cognito User Pool에 대한 접근 권한 추가
    authStack.userPool.grant(
      lambdaRole,
      'cognito-idp:AdminInitiateAuth',
      'cognito-idp:AdminCreateUser',
      'cognito-idp:AdminSetUserPassword',
      'cognito-idp:AdminGetUser',
    );

    // Todo Lambda 함수 생성
    this.todoLambda = new lambda.Function(this, 'TodoLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('src/lambda/todo'),
      role: lambdaRole,
      environment: {
        TODO_TABLE_NAME: databaseStack.todoTable.tableName,
        USER_TABLE_NAME: databaseStack.userTable.tableName,
        USER_POOL_ID: authStack.userPool.userPoolId,
        USER_POOL_CLIENT_ID: authStack.userPoolClient.userPoolClientId,
      },
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
    });

    // User Lambda 함수 생성
    this.userLambda = new lambda.Function(this, 'UserLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('src/lambda/user'),
      role: lambdaRole,
      environment: {
        USER_TABLE_NAME: databaseStack.userTable.tableName,
        USER_POOL_ID: authStack.userPool.userPoolId,
        USER_POOL_CLIENT_ID: authStack.userPoolClient.userPoolClientId,
      },
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
    });

    // 스택 출력값 설정
    new cdk.CfnOutput(this, 'TodoLambdaFunctionName', {
      value: this.todoLambda.functionName,
      description: 'Todo Lambda 함수 이름',
    });

    new cdk.CfnOutput(this, 'UserLambdaFunctionName', {
      value: this.userLambda.functionName,
      description: 'User Lambda 함수 이름',
    });
  }
}
