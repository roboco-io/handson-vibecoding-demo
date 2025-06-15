# TODO 앱 구현 체크리스트

이 문서는 설계 문서에 기반하여 TODO 앱 구현을 위한 작업 체크리스트를 제공합니다. 코어 비즈니스 로직은 TDD 방식으로 구현하며, 각 작업 단위별로 커밋 포인트를 표시했습니다.

## 작업 단계

1. [모노레포 프로젝트 초기화 및 기본 설정](./01-monorepo-setup.md)
2. [프론트엔드 코어 비즈니스 로직 구현](./02-frontend-core.md)
3. [프론트엔드 UI 컴포넌트 구현](./03-frontend-ui.md)
4. [프론트엔드 라우팅 및 앱 통합](./04-frontend-integration.md)
5. [프론트엔드 배포](./05-frontend-deployment.md)
6. [백엔드 개발](./06-backend-development.md)
7. [프론트엔드-백엔드 연동](./07-integration.md)
8. [인프라 및 배포](./08-infrastructure.md)

## 참고사항

- 코어 비즈니스 로직(Todo 모델, 상태 관리, 스토리지 어댑터, 커스텀 훅)은 반드시 TDD 방식으로 구현합니다.
- 각 작업이 완료될 때마다 해당 체크리스트 항목을 체크하고 커밋합니다.
- UI 컴포넌트는 Mantine을 사용하여 구현합니다.
- 모든 코드는 TypeScript로 작성하며, 적절한 타입 정의를 포함해야 합니다.
- 접근성(WCAG 2.1 AA 수준)을 고려하여 구현합니다.
- AWS 서버리스 아키텍처의 모범 사례를 준수합니다.
- Clean Architecture 원칙을 준수하여 구현합니다. 