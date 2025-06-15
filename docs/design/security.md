# 보안 설계

## 1. 인증 및 인가

### 1.1 Cognito 인증
```typescript
const cognitoConfig = {
  userPool: {
    selfSignUpEnabled: true,
    signInAliases: {
      email: true,
    },
    passwordPolicy: {
      minLength: 8,
      requireLowercase: true,
      requireUppercase: true,
      requireNumbers: true,
      requireSymbols: true,
    },
  },
  client: {
    oAuth: {
      flows: {
        authorizationCodeGrant: true,
      },
      scopes: ['email', 'openid', 'profile'],
    },
  },
};
```

### 1.2 API Gateway 인증
```typescript
const apiAuthConfig = {
  defaultAuthorizer: 'CognitoAuthorizer',
  authorizers: {
    CognitoAuthorizer: {
      type: 'COGNITO_USER_POOLS',
      providerARNs: [userPool.userPoolArn],
    },
  },
};
```

## 2. 데이터 보안

### 2.1 암호화
```typescript
const encryptionConfig = {
  dynamodb: {
    encryption: {
      type: 'AWS_OWNED',
    },
    pointInTimeRecovery: true,
  },
  s3: {
    encryption: {
      type: 'AES256',
    },
    versioning: true,
  },
};
```

### 2.2 데이터 마스킹
```typescript
const dataMaskingRules = {
  user: {
    fields: ['password', 'ssn', 'creditCard'],
    method: 'HASH',
  },
  todo: {
    fields: ['description'],
    method: 'PARTIAL',
  },
};
```

## 3. 네트워크 보안

### 3.1 VPC 구성
```typescript
const vpcSecurityConfig = {
  vpc: {
    maxAzs: 2,
    natGateways: 1,
  },
  securityGroups: {
    lambda: {
      inbound: [
        { port: 443, source: '0.0.0.0/0' },
      ],
      outbound: [
        { port: 443, destination: '0.0.0.0/0' },
      ],
    },
  },
};
```

### 3.2 WAF 규칙
```typescript
const wafRules = {
  rateLimit: {
    rateLimit: 2000,
    timeWindow: 300,
  },
  sqlInjection: {
    action: 'BLOCK',
    priority: 1,
  },
  xss: {
    action: 'BLOCK',
    priority: 2,
  },
};
```

## 4. 감사 및 모니터링

### 4.1 CloudTrail 설정
```typescript
const cloudTrailConfig = {
  name: 'TodoAppTrail',
  s3Bucket: 'todo-app-logs',
  includeGlobalServiceEvents: true,
  isMultiRegionTrail: true,
  enableLogFileValidation: true,
};
```

### 4.2 GuardDuty 설정
```typescript
const guardDutyConfig = {
  enabled: true,
  findingPublishingFrequency: 'FIFTEEN_MINUTES',
  dataSources: {
    s3: {
      enable: true,
    },
    dns: {
      enable: true,
    },
    kubernetes: {
      enable: true,
    },
  },
};
```

## 5. 컴플라이언스

### 5.1 데이터 보존 정책
```typescript
const dataRetentionPolicy = {
  userData: {
    retentionPeriod: 'P1Y', // 1년
    deletionMethod: 'SOFT_DELETE',
  },
  todoData: {
    retentionPeriod: 'P6M', // 6개월
    deletionMethod: 'HARD_DELETE',
  },
  auditLogs: {
    retentionPeriod: 'P3Y', // 3년
    deletionMethod: 'ARCHIVE',
  },
};
```

### 5.2 접근 제어 정책
```typescript
const accessControlPolicy = {
  roles: {
    admin: {
      permissions: ['*'],
      mfa: true,
    },
    developer: {
      permissions: ['read', 'write'],
      mfa: true,
    },
    user: {
      permissions: ['read'],
      mfa: false,
    },
  },
  ipRestrictions: {
    allowedRanges: ['10.0.0.0/8', '172.16.0.0/12'],
    blockedRanges: [],
  },
};
``` 