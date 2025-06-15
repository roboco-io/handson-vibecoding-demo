# TODO 웹 애플리케이션 아키텍처 개요

이 문서는 TODO 웹 애플리케이션의 아키텍처 및 설계 방향을 정의합니다. 이 애플리케이션은 Clean Architecture와 SOLID 원칙을 기반으로 설계되었습니다.

## 1. 모노레포 구조
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

## 2. 전체 아키텍처

![전체 아키텍처 다이어그램](./images/architecture-diagram.svg)

## 3. 개발 단계

1. **1단계**: 프론트엔드 구현 (로컬 스토리지 사용)
2. **2단계**: 백엔드 구현 (AWS 서버리스)
3. **3단계**: 프론트엔드-백엔드 연동
4. **4단계**: 인프라 및 배포

## 4. 테스트 전략

### 4.1 프론트엔드 테스트
1. **단위 테스트**: Jest를 사용하여 개별 컴포넌트, 훅, 유틸리티 함수 테스트
2. **통합 테스트**: React Testing Library를 사용하여 컴포넌트 통합 테스트
3. **E2E 테스트**: Cypress를 사용하여 전체 사용자 흐름 테스트

### 4.2 TDD 접근 방식
코어 비즈니스 로직 구현 시 TDD(테스트 주도 개발) 접근 방식을 사용합니다:
1. 실패하는 테스트 작성
2. 테스트를 통과하는 최소한의 코드 작성
3. 코드 리팩토링
4. 반복 