# 인프라 설계

## 1. AWS CDK 스택 구성

AWS CDK를 사용하여 인프라를 코드로 관리합니다:

```typescript
// CDK 스택 구조
interface CdkStacks {
  api: ApiGatewayStack;      // API Gateway
  auth: CognitoStack;        // Cognito
  database: DynamoDBStack;   // DynamoDB
  functions: LambdaStack;    // Lambda Functions
}

// 스택 간 의존성
const stackDependencies = {
  api: ['auth', 'functions'],
  functions: ['database', 'auth'],
  database: [],
  auth: [],
};
```

## 2. 리소스 구성

### 2.1 API Gateway
- REST API 엔드포인트
- CORS 설정
- 요청/응답 검증
- API 키 관리

### 2.2 Cognito
- 사용자 풀 설정
- 앱 클라이언트 구성
- 소셜 로그인 연동
- 토큰 관리

### 2.3 DynamoDB
- 테이블 설계
- 인덱스 구성
- 자동 스케일링
- 백업 설정

### 2.4 Lambda
- 함수 구성
- 메모리/타임아웃 설정
- 환경 변수
- IAM 역할

## 3. 네트워크 구성

### 3.1 VPC 설정
```typescript
const vpcConfig = {
  maxAzs: 2,
  natGateways: 1,
  subnetConfiguration: [
    {
      name: 'Private',
      subnetType: SubnetType.PRIVATE_WITH_EGRESS,
      cidrMask: 24,
    },
    {
      name: 'Public',
      subnetType: SubnetType.PUBLIC,
      cidrMask: 24,
    },
  ],
};
```

### 3.2 보안 그룹
```typescript
const securityGroups = {
  lambda: {
    description: 'Lambda function security group',
    vpc,
    allowAllOutbound: true,
  },
};
```

## 4. 배포 구성

### 4.1 환경별 설정
```typescript
const environments = {
  dev: {
    env: { account: '123456789012', region: 'ap-northeast-2' },
    domain: 'dev-api.example.com',
  },
  prod: {
    env: { account: '123456789012', region: 'ap-northeast-2' },
    domain: 'api.example.com',
  },
};
```

### 4.2 배포 파이프라인
```typescript
const pipeline = {
  stages: [
    {
      name: 'Source',
      actions: ['CodeCommit', 'CodeBuild'],
    },
    {
      name: 'Build',
      actions: ['TypeScript', 'UnitTest', 'IntegrationTest'],
    },
    {
      name: 'Deploy',
      actions: ['CDK', 'E2ETest'],
    },
  ],
};
```

## 5. 모니터링 구성

### 5.1 CloudWatch 설정
```typescript
const cloudWatchConfig = {
  metrics: [
    'LambdaDuration',
    'LambdaErrors',
    'ApiLatency',
    'DatabaseConnections',
  ],
  alarms: [
    {
      name: 'HighErrorRate',
      threshold: 1,
      period: 300,
      evaluationPeriods: 2,
    },
    {
      name: 'HighLatency',
      threshold: 1000,
      period: 300,
      evaluationPeriods: 2,
    },
  ],
};
```

### 5.2 로깅 설정
```typescript
const loggingConfig = {
  retention: RetentionDays.ONE_MONTH,
  logGroups: [
    '/aws/lambda/todo-api',
    '/aws/apigateway/todo-api',
    '/aws/cognito/user-pool',
  ],
};
``` 