# TODO 앱 구현 체크리스트

이 문서는 설계 문서에 기반하여 TODO 앱 구현을 위한 작업 체크리스트를 제공합니다. 코어 비즈니스 로직은 TDD 방식으로 구현하며, 각 작업 단위별로 커밋 포인트를 표시했습니다.

## 1단계: 모노레포 프로젝트 초기화 및 기본 설정

- [x] **1.1 모노레포 디렉토리 구조 생성**
  - [x] frontend/, backend/, shared/, infrastructure/, docs/, scripts/ 디렉토리 생성
  - [x] 각 영역별 README.md 작성 (간단 역할 설명)
  - **커밋**: "모노레포 디렉토리 구조 및 기본 문서 생성"

- [x] 루트에 프로젝트 설명용 README.md 작성 및 추가
  - **커밋**: "docs: 루트 프로젝트 설명용 README.md 생성 및 구조/규칙 명시"

- [x] **1.2 프론트엔드 프로젝트 설정**
  - [x] React + Vite + TypeScript + Mantine 프로젝트 초기화 (frontend/)
  - [x] Jest 및 React Testing Library 설정
  - [x] ESLint 및 Prettier 설정
  - [x] 기본 디렉토리 구조 생성 (src/, components/, hooks/ 등)
  - **커밋**: "feat: 프론트엔드 개발 환경 및 Mantine 설정"
  - [x] **1.2.1 프론트엔드 pre-commit hook 자동화**
    - [x] 실행 코드(js/ts/tsx) 변경 시에만 lint fix, build, test 자동 수행
    - [x] .husky/pre-commit에 스크립트 적용
    - **커밋**: "chore(frontend): pre-commit hook으로 실행코드 변경시 lint, build, test 자동화"

- [x] **1.3 공통 모듈(shared) 설정**
  - [x] 타입, 상수, 유틸리티 등 공통 코드 작성
  - [x] 프론트엔드에서 shared 모듈 참조 테스트
  - **커밋**: "shared 모듈 기본 구현 및 참조 테스트"

## 2단계: 프론트엔드 코어 비즈니스 로직 구현 (TDD)

- [x] **2.1 Todo 모델 정의**
  - [x] Todo 인터페이스 정의 (id, title, priority, status 등) - shared 모듈에 구현됨
  - [x] Todo 모델 테스트 작성
  - [x] Todo 모델 구현
  - **커밋**: "Todo 모델 정의 및 테스트"

- [x] **2.2 Todo 상태 관리 (Context + Reducer)**
  - [x] TodoAction 타입 정의 및 테스트
  - [x] TodoReducer 테스트 작성
  - [x] TodoReducer 구현
  - [x] TodoContext 테스트 작성
  - [x] TodoContext 및 Provider 구현
  - **커밋**: "Todo 상태 관리 로직 구현 (TDD)"

- [x] **2.3 로컬 스토리지 어댑터**
  - [x] 스토리지 인터페이스 정의 및 테스트
  - [x] 로컬 스토리지 어댑터 테스트 작성
  - [x] 로컬 스토리지 어댑터 구현
  - **커밋**: "로컬 스토리지 어댑터 구현 (TDD)"

- [x] **2.4 Todo 관련 커스텀 훅**
  - [x] useTodoHooks 훅 테스트 작성
  - [x] useTodoHooks 훅 구현
  - [x] TodoContext 테스트 수정 (useTodoHooks 사용)
  - [x] TodoReducer 테스트 수정 (useTodoHooks 사용)
  - **커밋**: "Todo 커스텀 훅 구현 및 테스트 수정 (TDD)"

## 3단계: 프론트엔드 UI 컴포넌트 구현 (Mantine 기반)

- [x] **3.1 공통 UI 컴포넌트 (Mantine 활용)**
  - [x] Button, Input, Checkbox, Select 등 Mantine 컴포넌트 래핑/활용
  - [x] AppShell, Notification 등 Mantine 고급 컴포넌트 적용
  - **커밋**: "공통 UI 컴포넌트(Mantine) 구현"

- [x] **3.2 Todo 관련 컴포넌트**
  - [x] TodoItem 컴포넌트 구현
  - [x] TodoList 컴포넌트 구현
  - [x] TodoForm 컴포넌트 구현 (TodoInput으로 구현)
  - [x] TodoFilter 컴포넌트 구현
  - **커밋**: "Todo 관련 컴포넌트 구현"

- [x] **3.3 레이아웃 컴포넌트**
  - [x] Header, Footer, Layout 컴포넌트 구현 (Mantine 활용)
  - **커밋**: "레이아웃 컴포넌트 구현"

- [x] **3.4 페이지 컴포넌트**
  - [x] TodoPage 등 주요 페이지 구현
  - **커밋**: "페이지 컴포넌트 구현"

## 4단계: 프론트엔드 라우팅 및 앱 통합

- [x] **4.1 반응형 디자인 수정**
  - [x] 브라우저 전체 너비에 맞게 레이아웃 조정
  - [x] 반응형 디자인 최종 점검
  - **커밋**: "레이아웃 수정 및 반응형 디자인 점검"
- [x] **4.2 앱 통합 및 테스트**
  - [x] **4.2.1 E2E 테스트 자동화 설정**
    - [x] Playwright 설치 및 설정
    - [x] 기본 테스트 구조 설정 (e2e 디렉토리, 설정 파일)
    - [x] 주요 사용자 시나리오 테스트 작성 (Todo CRUD 기능)
    - [x] 시각적 회귀 테스트 추가
    - **커밋**: "test: E2E 테스트 자동화 설정 (Playwright)"
  - [x] **4.2.2 E2E 테스트 자동화 통합**
    - [x] Husky pre-push 훅에 E2E 테스트 추가
    - [x] 테스트 결과 보고서 설정
    - **커밋**: "ci: E2E 테스트를 git pre-push 훅에 통합"
  - [x] 전체 앱 통합 및 테스트
  - **커밋**: "test: 앱 통합 및 테스트 완료"

## 5단계: 프론트엔드 배포

- [x] **5.1 프론트엔드 배포**
  - [x] GitHub Pages 배포 설정
  - [x] 배포 자동화 스크립트 작성
  - **커밋**: "ci: 프론트엔드 GitHub Pages 배포 설정 완료"

## 6단계: 백엔드 개발 (프론트엔드 완료 후)

- [ ] **6.1 백엔드 프로젝트 설정**
  - [ ] Node.js + TypeScript 프로젝트 초기화 (backend/)
  - [ ] Jest 등 테스트 환경 설정
  - [ ] ESLint 및 Prettier 설정
  - [ ] 기본 디렉토리 구조 생성 (src/)
  - **커밋**: "백엔드 개발 환경 설정"

- [ ] **6.2 백엔드 API 및 데이터 모델 구현**
  - [ ] Todo 모델 및 인터페이스 구현 (shared/types 활용)
  - [ ] API 엔드포인트 정의 및 구현
  - [ ] 데이터 저장소 연결 (DynamoDB 등)
  - **커밋**: "백엔드 API 및 데이터 모델 구현"

## 7단계: 프론트엔드-백엔드 연동

- [ ] **7.1 API 클라이언트 인터페이스(shared/types 활용)**
  - [ ] API 클라이언트 인터페이스 정의 및 테스트
  - [ ] API 엔드포인트 정의
  - **커밋**: "API 클라이언트 인터페이스 정의"

- [ ] **7.2 API 클라이언트 구현**
  - [ ] API 클라이언트 테스트 작성 (모킹)
  - [ ] API 클라이언트 구현
  - [ ] 에러 처리 로직 구현
  - **커밋**: "API 클라이언트 구현 (TDD)"

- [ ] **7.3 스토리지 전략 전환 메커니즘**
  - [ ] 로컬/원격 스토리지 전략 전환 테스트 및 구현
  - **커밋**: "스토리지 전략 전환 메커니즘 구현"

## 8단계: 인프라 및 배포

- [ ] **8.1 인프라 코드 작성**
  - [ ] AWS CDK 등 IaC 코드 작성 (infrastructure/)
  - [ ] 환경 변수/시크릿 관리
  - **커밋**: "인프라 코드 및 환경 설정"

- [ ] **8.2 CI/CD 파이프라인 구축**
  - [ ] 빌드/테스트/배포 자동화 (GitHub Actions 등)
  - [ ] 모노레포 패키지별 테스트/배포 최적화
  - **커밋**: "CI/CD 파이프라인 구축"

- [ ] **8.3 백엔드 배포 및 통합 테스트**
  - [ ] 백엔드 배포 및 smoke test
  - [ ] 프론트엔드-백엔드 통합 테스트
  - [ ] 운영 환경 점검 및 모니터링 설정
  - **커밋**: "백엔드 배포 및 통합 테스트 완료"

## 참고사항

- 코어 비즈니스 로직(Todo 모델, 상태 관리, 스토리지 어댑터, 커스텀 훅)은 반드시 TDD 방식으로 구현합니다.
- 각 작업이 완료될 때마다 해당 체크리스트 항목을 체크하고 커밋합니다.
- UI 컴포넌트는 Mantine을 사용하여 구현합니다.
- 모든 코드는 TypeScript로 작성하며, 적절한 타입 정의를 포함해야 합니다.
- 접근성(WCAG 2.1 AA 수준)을 고려하여 구현합니다.
