# 1단계: 모노레포 프로젝트 초기화 및 기본 설정

- [x] **1.1 모노레포 디렉토리 구조 생성**
  - [x] frontend/, backend/, shared/, docs/, scripts/ 디렉토리 생성
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