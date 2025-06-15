# 2단계: 프론트엔드 코어 비즈니스 로직 구현 (TDD)

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