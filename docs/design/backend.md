# 백엔드 설계

## 1. 아키텍처

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
```

## 2. API 설계

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

## 3. 데이터 모델

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

## 4. 인증 및 권한

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

## 5. Lambda 함수 설계

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