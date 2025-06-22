import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class DatabaseStack extends cdk.Stack {
  public readonly todoTable: dynamodb.Table;
  public readonly userTable: dynamodb.Table;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Todo 테이블 생성
    this.todoTable = new dynamodb.Table(this, 'TodoTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // 개발 환경용
      timeToLiveAttribute: 'ttl',
    });

    // Todo 테이블 GSI 설정
    this.todoTable.addGlobalSecondaryIndex({
      indexName: 'userId-index',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // User 테이블 생성
    this.userTable = new dynamodb.Table(this, 'UserTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // 개발 환경용
      timeToLiveAttribute: 'ttl',
    });

    // User 테이블 GSI 설정
    this.userTable.addGlobalSecondaryIndex({
      indexName: 'email-index',
      partitionKey: { name: 'email', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // 스택 출력값 설정
    new cdk.CfnOutput(this, 'TodoTableName', {
      value: this.todoTable.tableName,
      description: 'Todo 테이블 이름',
    });

    new cdk.CfnOutput(this, 'UserTableName', {
      value: this.userTable.tableName,
      description: 'User 테이블 이름',
    });
  }
}
