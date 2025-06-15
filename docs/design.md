# TODO 웹 애플리케이션 설계 문서

## 1. 아키텍처 개요

이 문서는 TODO 웹 애플리케이션의 아키텍처 및 설계 방향을 정의합니다. 이 애플리케이션은 Clean Architecture와 SOLID 원칙을 기반으로 설계되었습니다.

### 1.1 모노레포 구조
- 프론트엔드, 백엔드, 공유 모듈을 하나의 저장소에서 통합 관리합니다.
- 예시 디렉토리 구조:
  - frontend/: React + Mantine 기반 프론트엔드
  - backend/: Node.js + TypeScript 기반 백엔드 (Lambda + CDK)
    - src/: Lambda 함수 소스 코드
      - application/: 유스케이스 구현
      - domain/: 도메인 모델 및 인터페이스
      - infrastructure/: 외부 서비스 구현
        - dynamodb/: DynamoDB 어댑터
        - cognito/: Cognito 어댑터
      - interfaces/: API 인터페이스
        - rest/: REST API 컨트롤러
      - main/: 애플리케이션 진입점
    - lib/: CDK 스택 정의
      - api/: API Gateway 스택
      - auth/: Cognito 스택
      - database/: DynamoDB 스택
      - lambda/: Lambda 함수 스택
    - test/: 테스트 코드
  - shared/: 공통 타입, 유틸리티 등
- 장점: 
  - 패키지 간 의존성 관리
  - 일관된 빌드/테스트
  - 코드 재사용
  - 공통 타입 공유
  - Lambda 함수와 인프라 코드의 긴밀한 통합
  - 배포 프로세스 단순화

### 1.2 전체 아키텍처

![전체 아키텍처 다이어그램](./images/architecture-diagram.svg)

### 1.3 개발 단계

1. **1단계**: 프론트엔드 구현 (로컬 스토리지 사용)
2. **2단계**: 백엔드 구현 (AWS 서버리스)
3. **3단계**: 프론트엔드-백엔드 연동
4. **4단계**: 인프라 및 배포

## 2. 프론트엔드 설계

### 2.1 컴포넌트 구조

Mantine UI Kit 기반으로 컴포넌트를 설계합니다. Mantine의 Card, Checkbox, Select, TextInput, Button, AppShell, Notification 등 주요 컴포넌트를 적극 활용하여 모던하고 일관된 UI/UX를 구현합니다.

![컴포넌트 구조 다이어그램](./images/component-diagram.svg)

### 2.2 디렉토리 구조

```
root/
├── frontend/       # 프론트엔드(React + Mantine)
│   └── src/
│       ├── assets/            # 이미지, 아이콘 등 정적 자산
│       ├── components/        # 재사용 가능한 UI 컴포넌트
│       │   ├── common/        # 공통 컴포넌트 (버튼, 입력 필드 등)
│       │   ├── layout/        # 레이아웃 관련 컴포넌트
│       │   └── todo/          # Todo 관련 컴포넌트
│       ├── contexts/          # React Context API
│       ├── hooks/             # 커스텀 훅
│       ├── pages/             # 페이지 컴포넌트
│       ├── services/          # 외부 서비스 통신 로직
│       │   └── storage/       # 로컬 스토리지 관리
│       ├── types/             # TypeScript 타입 정의
│       ├── utils/             # 유틸리티 함수
│       └── App.tsx            # 애플리케이션 진입점
├── shared/         # 타입, 상수, 공통 유틸리티
└── docs/           # 문서
```

- 각 영역은 독립적으로 빌드/테스트 가능하며, 공통 타입은 shared에서 관리합니다.

### 2.3 상태 관리

React Context API와 useReducer를 사용하여 상태 관리를 구현합니다.

```typescript
// Todo 상태 타입 정의
interface Todo {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: string;
}

// Todo 상태 액션 타입
type TodoAction =
  | { type: 'ADD_TODO'; payload: Omit<Todo, 'id' | 'createdAt'> }
  | { type: 'UPDATE_TODO'; payload: Todo }
  | { type: 'DELETE_TODO'; payload: string }
  | { type: 'TOGGLE_TODO'; payload: string }
  | { type: 'SET_TODOS'; payload: Todo[] };

// Todo 상태 리듀서
const todoReducer = (state: Todo[], action: TodoAction): Todo[] => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        {
          id: Date.now().toString(),
          ...action.payload,
          createdAt: new Date().toISOString(),
        },
      ];
    case 'UPDATE_TODO':
      return state.map((todo) =>
        todo.id === action.payload.id ? action.payload : todo
      );
    case 'DELETE_TODO':
      return state.filter((todo) => todo.id !== action.payload);
    case 'TOGGLE_TODO':
      return state.map((todo) =>
        todo.id === action.payload
          ? { ...todo, completed: !todo.completed }
          : todo
      );
    case 'SET_TODOS':
      return action.payload;
    default:
      return state;
  }
};
```

### 2.4 스토리지 전략

로컬 스토리지를 사용하여 데이터를 관리합니다.

```typescript
// 스토리지 인터페이스
interface StorageService {
  getTodos(): Promise<Todo[]>;
  saveTodos(todos: Todo[]): Promise<void>;
}

// 로컬 스토리지 구현
class LocalStorageService implements StorageService {
  private readonly STORAGE_KEY = 'todos';

  async getTodos(): Promise<Todo[]> {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  async saveTodos(todos: Todo[]): Promise<void> {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
  }
}
```

## 3. 테스트 전략

### 3.1 프론트엔드 테스트

1. **단위 테스트**: Jest를 사용하여 개별 컴포넌트, 훅, 유틸리티 함수 테스트
2. **통합 테스트**: React Testing Library를 사용하여 컴포넌트 통합 테스트
3. **E2E 테스트**: Cypress를 사용하여 전체 사용자 흐름 테스트

### 3.2 TDD 접근 방식

코어 비즈니스 로직 구현 시 TDD(테스트 주도 개발) 접근 방식을 사용합니다:

1. 실패하는 테스트 작성
2. 테스트를 통과하는 최소한의 코드 작성
3. 코드 리팩토링
4. 반복

## 4. 백엔드 설계

### 4.1 아키텍처

AWS 서버리스 아키텍처를 기반으로 설계합니다:

```
root/
├── backend/        # 백엔드(Node.js + TypeScript)
│   └── src/
│       ├── application/    # 유스케이스 구현
│       ├── domain/         # 도메인 모델 및 인터페이스
│       ├── infrastructure/ # 외부 서비스 구현
│       │   ├── dynamodb/   # DynamoDB 어댑터
│       │   └── cognito/    # Cognito 어댑터
│       ├── interfaces/     # API 인터페이스
│       │   └── rest/       # REST API 컨트롤러
│       └── main/           # 애플리케이션 진입점
└── infrastructure/ # AWS CDK 인프라 코드
    └── lib/
        ├── api/           # API Gateway 스택
        ├── auth/          # Cognito 스택
        ├── database/      # DynamoDB 스택
        └── lambda/        # Lambda 함수 스택
```

### 4.2 API 설계

RESTful API 원칙을 준수하여 설계합니다:

```typescript
// API 엔드포인트 정의
const API_ENDPOINTS = {
  TODOS: '/api/v1/todos',
  TODO: (id: string) => `/api/v1/todos/${id}`,
};

// API 응답 형식
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// HTTP 메서드별 동작
const HTTP_METHODS = {
  GET: '조회',
  POST: '생성',
  PUT: '수정',
  DELETE: '삭제',
} as const;
```

### 4.3 데이터 모델

DynamoDB 단일 테이블 디자인을 적용합니다:

```typescript
// DynamoDB 테이블 스키마
interface TodoTable {
  PK: string;  // USER#${userId}
  SK: string;  // TODO#${todoId}
  GSI1PK: string;  // STATUS#${status}
  GSI1SK: string;  // CREATED_AT#${timestamp}
  title: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed';
  createdAt: string;
  updatedAt: string;
}
```

### 4.4 인증 및 권한

Cognito를 통한 인증 및 권한 관리를 구현합니다:

```typescript
// 권한 레벨 정의
enum PermissionLevel {
  PUBLIC = 'public',
  AUTHENTICATED = 'authenticated',
  ADMIN = 'admin',
}

// API Gateway 권한 설정
const API_PERMISSIONS = {
  [API_ENDPOINTS.TODOS]: {
    GET: PermissionLevel.AUTHENTICATED,
    POST: PermissionLevel.AUTHENTICATED,
  },
  [API_ENDPOINTS.TODO('*')]: {
    GET: PermissionLevel.AUTHENTICATED,
    PUT: PermissionLevel.AUTHENTICATED,
    DELETE: PermissionLevel.AUTHENTICATED,
  },
};
```

### 4.5 Lambda 함수 설계

Clean Architecture 원칙을 적용한 Lambda 함수 설계:

```typescript
// Lambda 함수 핸들러
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const useCase = new TodoUseCase(
      new DynamoDBRepository(),
      new CognitoAuthService()
    );
    
    const result = await useCase.execute(event);
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: result,
      }),
    };
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({
        success: false,
        error: {
          code: error.code,
          message: error.message,
        },
      }),
    };
  }
};
```

## 5. 인프라 설계

### 5.1 AWS CDK 스택 구성

```typescript
// CDK 스택 구조
class TodoAppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Cognito 스택
    const auth = new AuthStack(this, 'AuthStack');
    
    // DynamoDB 스택
    const database = new DatabaseStack(this, 'DatabaseStack');
    
    // Lambda 함수 스택
    const lambda = new LambdaStack(this, 'LambdaStack', {
      database,
      auth,
    });
    
    // API Gateway 스택
    const api = new ApiStack(this, 'ApiStack', {
      lambda,
      auth,
    });
  }
}
```

### 5.2 CI/CD 파이프라인

GitHub Actions를 사용한 CI/CD 파이프라인 구성:

```yaml
# GitHub Actions 워크플로우
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Tests
        run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to AWS
        run: npm run deploy
```

## 6. 모니터링 및 로깅

### 6.1 CloudWatch 설정

```typescript
// CloudWatch 알람 설정
const createAlarm = (metric: Metric, threshold: number) => {
  new Alarm(this, `${metric.metricName}Alarm`, {
    metric,
    threshold,
    evaluationPeriods: 1,
    alarmDescription: `Alarm when ${metric.metricName} exceeds ${threshold}`,
  });
};
```

### 6.2 X-Ray 추적

```typescript
// X-Ray 추적 설정
const tracer = new XRayTracer({
  serviceName: 'todo-app',
  plugins: ['ECSPlugin', 'EC2Plugin'],
});
```

## 7. 보안 설계

### 7.1 API Gateway 보안

```typescript
// API Gateway 보안 설정
const api = new RestApi(this, 'TodoApi', {
  defaultCorsPreflightOptions: {
    allowOrigins: ['https://your-domain.com'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowHeaders: ['Authorization', 'Content-Type'],
  },
});
```

### 7.2 Lambda 함수 보안

```typescript
// Lambda 함수 보안 설정
const lambda = new Function(this, 'TodoFunction', {
  runtime: Runtime.NODEJS_18_X,
  handler: 'index.handler',
  vpc: vpc,
  securityGroups: [securityGroup],
  environment: {
    NODE_ENV: 'production',
  },
});
```

## 8. 비용 최적화

### 8.1 Lambda 함수 최적화

```typescript
// Lambda 함수 최적화 설정
const lambda = new Function(this, 'TodoFunction', {
  memorySize: 256,
  timeout: Duration.seconds(10),
  environment: {
    POWERTOOLS_SERVICE_NAME: 'todo-app',
    POWERTOOLS_METRICS_NAMESPACE: 'TodoApp',
  },
});
```

### 8.2 DynamoDB 최적화

```typescript
// DynamoDB 최적화 설정
const table = new Table(this, 'TodoTable', {
  billingMode: BillingMode.PAY_PER_REQUEST,
  pointInTimeRecovery: true,
  removalPolicy: RemovalPolicy.RETAIN,
});
```

## 9. 구현 계획

### 9.1 1단계: 프론트엔드 초기 구현 (로컬 스토리지)

1. 프로젝트 설정 (React + Vite + TypeScript + Mantine)
2. 기본 UI 컴포넌트 구현
3. 상태 관리 구현 (Context API + useReducer)
4. 로컬 스토리지 통합
5. 테스트 작성

### 9.2 2단계: 백엔드 구현 (AWS 서버리스)
1. 기본 인프라 구성 (CDK)
2. DynamoDB 테이블 설계 및 구현
3. Lambda 함수 구현 (CRUD)
4. API Gateway 설정
5. Cognito 통합

### 9.3 3단계: 프론트엔드-백엔드 연동
1. API 클라이언트 구현
2. 스토리지 전략 전환
3. 에러 처리 구현
4. 통합 테스트

### 9.4 4단계: 인프라 및 배포
1. CI/CD 파이프라인 구축
2. 모니터링 및 로깅 설정
3. 보안 강화
4. 성능 최적화

## 10. 결론

이 설계 문서는 TODO 웹 애플리케이션의 아키텍처, 컴포넌트, 데이터 모델, 테스트 전략 및 구현 계획을 정의합니다. Clean Architecture와 SOLID 원칙을 기반으로 설계되었으며, 확장성과 유지보수성을 고려했습니다.

이 문서는 프로젝트 진행 과정에서 업데이트될 수 있습니다.

## 11. Git Hooks & 자동화

- 프론트엔드 실행 코드(js/ts/tsx) 변경 시 pre-commit hook을 통해 lint fix, build, test가 자동으로 수행됨
- .husky/pre-commit에 스크립트 적용, 실행 코드 외 변경시에는 훅이 동작하지 않음
