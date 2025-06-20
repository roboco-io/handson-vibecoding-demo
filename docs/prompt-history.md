# 프롬프트 히스토리

이 문서는 바이브 코딩 학습 과정에서의 프롬프트와 결과를 기록합니다.

## 프로젝트 초기 설정 및 구조화

### 프롬프트
```
프로젝트의 초기 구조와 개발 규칙을 설정해줘. 모노레포 구조로 구성하고, 프론트엔드는 Mantine UI를 사용할 예정이야.
```

### 프롬프트 의도
- 프로젝트의 기본 구조 설정
- 개발 규칙 및 워크플로우 정의
- 기술 스택 선정 및 설정

### 결과 요약
- 모노레포 구조 설정
- Mantine UI 기반 프론트엔드 구성
- 개발 규칙 및 체크리스트 문서화
- 디렉토리 구조 및 README 파일 생성

### 후속 조치
- 프론트엔드 개발 환경 구축
- 백엔드 개발 환경 설정
- 테스트 환경 구성

#docs #chore

## 프론트엔드 개발 환경 설정

### 프롬프트
```
설계 문서에 따라 프론트엔드 개발 환경을 설정해줘.
```

### 프롬프트 의도
- 프론트엔드 개발 환경 구축
- 테스트 및 코드 품질 도구 설정
- UI 라이브러리 통합

### 결과 요약
- Vite + React + TypeScript 템플릿 적용
- Mantine UI, Jest, ESLint, Prettier 설정
- 컴포넌트 및 훅 디렉토리 구조 생성
- pre-commit 훅 설정

### 후속 조치
- Todo 컴포넌트 구현
- 상태 관리 로직 개발
- 테스트 코드 작성

#chore #test

## Todo 앱 기능 구현

### 프롬프트
```
Todo 앱의 기본 기능을 구현해줘. 할 일 추가, 삭제, 완료 처리 기능과 우선순위 설정 기능이 필요해.
```

### 프롬프트 의도
- Todo 앱의 핵심 기능 구현
- 사용자 인터페이스 개발
- 상태 관리 로직 구현

### 결과 요약
- Todo 모델 및 인터페이스 정의
- 로컬 스토리지 어댑터 구현
- Todo 커스텀 훅 개발
- Mantine v7 기반 UI 구현
- 우선순위 선택 기능 추가

### 후속 조치
- E2E 테스트 구현
- 반응형 레이아웃 개선
- 성능 최적화

#feat #style

## 테스트 자동화 및 CI/CD 설정

### 프롬프트
```
테스트 자동화와 CI/CD 파이프라인을 설정해줘. GitHub Actions를 사용하고, E2E 테스트도 포함해줘.
```

### 프롬프트 의도
- 테스트 자동화 환경 구축
- CI/CD 파이프라인 설정
- 품질 관리 프로세스 수립

### 결과 요약
- Playwright E2E 테스트 설정
- GitHub Actions 워크플로우 구성
- GitHub Pages 배포 설정
- pre-push 훅에 E2E 테스트 통합

### 후속 조치
- 테스트 커버리지 개선
- 배포 프로세스 최적화
- 성능 모니터링 도구 통합

#test #chore

## 백엔드 개발 환경 설정

### 프롬프트
```
AWS 서버리스 아키텍처 기반으로 백엔드 개발 환경을 설정해줘.
```

### 프롬프트 의도
- AWS 서버리스 기반 백엔드 환경 구축
- 개발 도구 및 테스트 환경 설정
- 인프라 구성 최적화

### 결과 요약
- ESLint flat config 설정
- TypeScript 빌드 설정
- Jest 테스트 환경 구성
- git hook 설정

### 후속 조치
- DynamoDB 연동
- API 엔드포인트 구현
- 서버리스 함수 개발

#chore #test

## 백엔드 인프라 구성 변경

### 프롬프트
```
RDS를 제거하고 DynamoDB만 사용하도록 인프라를 변경해줘.
```

### 프롬프트 의도
- 인프라 단순화
- 비용 최적화
- 서버리스 아키텍처 강화

### 결과 요약
- RDS 보안 그룹 제거
- DynamoDB 중심 아키텍처로 전환
- 백엔드와 인프라 디렉토리 구조 통합

### 후속 조치
- DynamoDB 스키마 설계
- 데이터 마이그레이션 계획
- 성능 테스트

#refactor #chore

## 백엔드 CDK 스택 구현

### 프롬프트
```
CDK 기반으로 Database, Auth, Lambda, API Gateway 스택을 Clean Architecture 원칙에 맞게 구현해줘.
```

### 프롬프트 의도
- AWS CDK를 활용한 인프라 IaC 구현
- 각 도메인별 스택 분리 및 의존성 명확화
- 서버리스 아키텍처와 최소 권한 원칙 적용

### 결과 요약
- DatabaseStack: DynamoDB 테이블, GSI, TTL, 자동 스케일링
- AuthStack: Cognito User Pool, App Client, OAuth
- LambdaStack: Todo/User Lambda, 환경 변수, IAM 역할
- ApiStack: API Gateway, CORS, Cognito 인증
- CDK synth 정상 동작 및 의존성/권한/보안 인수조건 충족

### 후속 조치
- 유스케이스(Application Layer) 구현
- 인프라 어댑터(DynamoDB, Cognito) 구현
- API 컨트롤러 및 Lambda 핸들러 구현

#infra #cdk #tdd 