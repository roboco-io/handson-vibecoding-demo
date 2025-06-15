# 비용 최적화 설계

## 1. Lambda 최적화

### 1.1 메모리 설정
```typescript
const lambdaMemoryConfig = {
  development: {
    memorySize: 128,
    timeout: 30,
  },
  production: {
    memorySize: 256,
    timeout: 60,
  },
};
```

### 1.2 프로비저닝된 동시성
```typescript
const provisionedConcurrency = {
  development: {
    min: 0,
    max: 10,
  },
  production: {
    min: 5,
    max: 100,
  },
};
```

## 2. DynamoDB 최적화

### 2.1 용량 모드
```typescript
const dynamoDBCapacity = {
  development: {
    mode: 'PAY_PER_REQUEST',
    autoScaling: false,
  },
  production: {
    mode: 'PROVISIONED',
    readCapacity: 5,
    writeCapacity: 5,
    autoScaling: {
      targetUtilization: 70,
      minCapacity: 5,
      maxCapacity: 100,
    },
  },
};
```

### 2.2 TTL 설정
```typescript
const dynamoDBTTL = {
  todos: {
    ttl: 30 * 24 * 60 * 60, // 30일
    attribute: 'expiresAt',
  },
  sessions: {
    ttl: 24 * 60 * 60, // 24시간
    attribute: 'expiresAt',
  },
};
```

## 3. API Gateway 최적화

### 3.1 캐싱 설정
```typescript
const apiGatewayCache = {
  enabled: true,
  ttl: 300, // 5분
  dataEncrypted: true,
  cacheKeyParameters: [
    'method.request.header.Authorization',
    'method.request.querystring.status',
  ],
};
```

### 3.2 요청 제한
```typescript
const apiGatewayThrottling = {
  rateLimit: 1000,
  burstLimit: 2000,
  quotas: {
    daily: 100000,
    monthly: 3000000,
  },
};
```

## 4. CloudFront 최적화

### 4.1 캐시 동작
```typescript
const cloudFrontCache = {
  defaultTTL: 86400, // 24시간
  minTTL: 0,
  maxTTL: 31536000, // 1년
  compress: true,
  priceClass: 'PriceClass_100', // 북미, 유럽
};
```

### 4.2 원본 요청 정책
```typescript
const originRequestPolicy = {
  headerBehavior: 'whitelist',
  headers: [
    'Authorization',
    'Host',
    'Origin',
  ],
  queryStringBehavior: 'whitelist',
  queryStrings: [
    'status',
    'priority',
  ],
};
```

## 5. 비용 모니터링

### 5.1 예산 설정
```typescript
const budgets = {
  monthly: {
    amount: 100,
    notifications: [
      {
        threshold: 80,
        type: 'ACTUAL',
        comparisonOperator: 'GREATER_THAN',
      },
      {
        threshold: 100,
        type: 'FORECASTED',
        comparisonOperator: 'GREATER_THAN',
      },
    ],
  },
  daily: {
    amount: 5,
    notifications: [
      {
        threshold: 80,
        type: 'ACTUAL',
        comparisonOperator: 'GREATER_THAN',
      },
    ],
  },
};
```

### 5.2 비용 할당 태그
```typescript
const costAllocationTags = {
  environment: ['development', 'production'],
  service: ['api', 'frontend', 'database'],
  team: ['backend', 'frontend', 'devops'],
  project: ['todo-app'],
};
```

## 6. 자동화된 최적화

### 6.1 Lambda 함수 최적화
```typescript
const lambdaOptimization = {
  autoScaling: {
    targetUtilization: 70,
    scaleInCooldown: 300,
    scaleOutCooldown: 60,
  },
  provisionedConcurrency: {
    autoScaling: true,
    targetUtilization: 70,
  },
};
```

### 6.2 DynamoDB 최적화
```typescript
const dynamoDBOptimization = {
  autoScaling: {
    targetUtilization: 70,
    scaleInCooldown: 300,
    scaleOutCooldown: 60,
  },
  backup: {
    pointInTimeRecovery: true,
    continuousBackup: true,
  },
};
``` 