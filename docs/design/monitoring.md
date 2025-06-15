# 모니터링 및 로깅 설계

## 1. CloudWatch 메트릭

### 1.1 Lambda 메트릭
```typescript
const lambdaMetrics = {
  duration: {
    statistic: 'Average',
    period: 300,
    threshold: 1000, // 1초
  },
  errors: {
    statistic: 'Sum',
    period: 300,
    threshold: 0,
  },
  throttles: {
    statistic: 'Sum',
    period: 300,
    threshold: 0,
  },
  concurrentExecutions: {
    statistic: 'Maximum',
    period: 300,
    threshold: 1000,
  },
};
```

### 1.2 API Gateway 메트릭
```typescript
const apiMetrics = {
  latency: {
    statistic: 'Average',
    period: 300,
    threshold: 100, // 100ms
  },
  '4xxErrors': {
    statistic: 'Sum',
    period: 300,
    threshold: 0,
  },
  '5xxErrors': {
    statistic: 'Sum',
    period: 300,
    threshold: 0,
  },
  requestCount: {
    statistic: 'Sum',
    period: 300,
    threshold: 1000,
  },
};
```

## 2. 알람 설정

### 2.1 성능 알람
```typescript
const performanceAlarms = {
  highLatency: {
    metric: 'Latency',
    threshold: 1000,
    evaluationPeriods: 2,
    period: 300,
    comparisonOperator: 'GreaterThanThreshold',
    treatMissingData: 'notBreaching',
  },
  highErrorRate: {
    metric: 'ErrorRate',
    threshold: 1,
    evaluationPeriods: 2,
    period: 300,
    comparisonOperator: 'GreaterThanThreshold',
    treatMissingData: 'notBreaching',
  },
};
```

### 2.2 비용 알람
```typescript
const costAlarms = {
  highCost: {
    metric: 'EstimatedCharges',
    threshold: 100,
    evaluationPeriods: 1,
    period: 86400, // 24시간
    comparisonOperator: 'GreaterThanThreshold',
    treatMissingData: 'notBreaching',
  },
  unusualSpike: {
    metric: 'EstimatedCharges',
    threshold: 50,
    evaluationPeriods: 1,
    period: 3600, // 1시간
    comparisonOperator: 'GreaterThanThreshold',
    treatMissingData: 'notBreaching',
  },
};
```

## 3. 로깅 전략

### 3.1 로그 레벨
```typescript
const logLevels = {
  error: {
    level: 'ERROR',
    retention: RetentionDays.ONE_MONTH,
    filter: 'ERROR',
  },
  warn: {
    level: 'WARN',
    retention: RetentionDays.ONE_WEEK,
    filter: 'WARN',
  },
  info: {
    level: 'INFO',
    retention: RetentionDays.THREE_DAYS,
    filter: 'INFO',
  },
  debug: {
    level: 'DEBUG',
    retention: RetentionDays.ONE_DAY,
    filter: 'DEBUG',
  },
};
```

### 3.2 로그 포맷
```typescript
const logFormat = {
  timestamp: 'ISO8601',
  level: 'string',
  requestId: 'string',
  userId: 'string',
  action: 'string',
  resource: 'string',
  duration: 'number',
  error: 'object?',
  metadata: 'object?',
};
```

## 4. 대시보드

### 4.1 운영 대시보드
```typescript
const operationalDashboard = {
  widgets: [
    {
      type: 'metric',
      properties: {
        metrics: [
          ['AWS/Lambda', 'Duration'],
          ['AWS/Lambda', 'Errors'],
          ['AWS/Lambda', 'Throttles'],
        ],
        period: 300,
        stat: 'Average',
        region: 'ap-northeast-2',
        title: 'Lambda Metrics',
      },
    },
    {
      type: 'metric',
      properties: {
        metrics: [
          ['AWS/ApiGateway', 'Latency'],
          ['AWS/ApiGateway', '4XXError'],
          ['AWS/ApiGateway', '5XXError'],
        ],
        period: 300,
        stat: 'Average',
        region: 'ap-northeast-2',
        title: 'API Gateway Metrics',
      },
    },
  ],
};
```

### 4.2 비즈니스 대시보드
```typescript
const businessDashboard = {
  widgets: [
    {
      type: 'metric',
      properties: {
        metrics: [
          ['Custom', 'ActiveUsers'],
          ['Custom', 'NewUsers'],
          ['Custom', 'CompletedTasks'],
        ],
        period: 3600,
        stat: 'Sum',
        region: 'ap-northeast-2',
        title: 'User Metrics',
      },
    },
    {
      type: 'metric',
      properties: {
        metrics: [
          ['Custom', 'TaskCreationRate'],
          ['Custom', 'TaskCompletionRate'],
          ['Custom', 'TaskDeletionRate'],
        ],
        period: 3600,
        stat: 'Sum',
        region: 'ap-northeast-2',
        title: 'Task Metrics',
      },
    },
  ],
};
```

## 5. 알림 설정

### 5.1 SNS 토픽
```typescript
const snsTopics = {
  alerts: {
    name: 'TodoAppAlerts',
    protocol: 'email',
    endpoint: 'alerts@example.com',
  },
  notifications: {
    name: 'TodoAppNotifications',
    protocol: 'email',
    endpoint: 'notifications@example.com',
  },
};
```

### 5.2 알림 규칙
```typescript
const notificationRules = {
  critical: {
    conditions: ['ERROR', 'CRITICAL'],
    channels: ['SMS', 'Email'],
    cooldown: 300, // 5분
  },
  warning: {
    conditions: ['WARNING'],
    channels: ['Email'],
    cooldown: 3600, // 1시간
  },
  info: {
    conditions: ['INFO'],
    channels: ['Email'],
    cooldown: 86400, // 24시간
  },
};
``` 