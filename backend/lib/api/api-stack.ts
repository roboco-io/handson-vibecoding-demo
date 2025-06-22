import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { LambdaStack } from '../lambda/lambda-stack';
import { AuthStack } from '../auth/auth-stack';

export class ApiStack extends cdk.Stack {
  public readonly api: apigateway.RestApi;

  constructor(
    scope: Construct,
    id: string,
    lambdaStack: LambdaStack,
    authStack: AuthStack,
    props?: cdk.StackProps,
  ) {
    super(scope, id, props);

    // Cognito 인증자 생성
    const authorizer = new apigateway.CognitoUserPoolsAuthorizer(this, 'TodoAppAuthorizer', {
      cognitoUserPools: [authStack.userPool],
    });

    // API Gateway 생성
    this.api = new apigateway.RestApi(this, 'TodoAppApi', {
      restApiName: 'Todo App API',
      description: 'Todo App API Gateway',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: [
          'Content-Type',
          'X-Amz-Date',
          'Authorization',
          'X-Api-Key',
          'X-Amz-Security-Token',
          'X-Amz-User-Agent',
        ],
      },
    });

    // Todo API 리소스 생성
    const todoResource = this.api.root.addResource('todos');
    const todoIdResource = todoResource.addResource('{id}');

    // Todo API 메서드 생성
    todoResource.addMethod('GET', new apigateway.LambdaIntegration(lambdaStack.todoLambda), {
      authorizer,
    });

    todoResource.addMethod('POST', new apigateway.LambdaIntegration(lambdaStack.todoLambda), {
      authorizer,
    });

    todoIdResource.addMethod('GET', new apigateway.LambdaIntegration(lambdaStack.todoLambda), {
      authorizer,
    });

    todoIdResource.addMethod('PUT', new apigateway.LambdaIntegration(lambdaStack.todoLambda), {
      authorizer,
    });

    todoIdResource.addMethod('DELETE', new apigateway.LambdaIntegration(lambdaStack.todoLambda), {
      authorizer,
    });

    // User API 리소스 생성
    const userResource = this.api.root.addResource('users');
    const userAuthResource = userResource.addResource('auth');

    // User API 메서드 생성
    userResource.addMethod('GET', new apigateway.LambdaIntegration(lambdaStack.userLambda), {
      authorizer,
    });

    userResource.addMethod('POST', new apigateway.LambdaIntegration(lambdaStack.userLambda));

    userAuthResource.addMethod('POST', new apigateway.LambdaIntegration(lambdaStack.userLambda));

    // 스택 출력값 설정
    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: this.api.url,
      description: 'API Gateway 엔드포인트 URL',
    });
  }
}
