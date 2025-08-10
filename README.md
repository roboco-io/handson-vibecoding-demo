> 현재 이 리포지토리는 https://github.com/Hands-On-Vibe-Coding/handson-vibecoding-demo 으로 옮겨져서 유지보수되고 있습니다.

# Vibecoding TODO App Monorepo

이 프로젝트는 모던 웹 개발 및 인프라 자동화 베스트 프랙티스를 반영한 TODO 앱 모노레포입니다.

## 주요 특징
- **모노레포 구조**: 프론트엔드, 백엔드, 공유 모듈, 인프라, 문서, 스크립트 통합 관리
- **프론트엔드**: React, Mantine UI, TypeScript, Vite 기반
- **백엔드**: Node.js, TypeScript, Clean Architecture, TDD
- **공통 모듈(shared)**: 타입, 상수, 유틸리티 등 패키지간 코드 재사용
- **인프라(infrastructure)**: AWS CDK 기반 IaC, CI/CD 자동화
- **문서화(docs)**: 요구사항, 설계, 체크리스트 등 체계적 관리
- **자동화(Git Hooks)**: 프론트엔드 실행 코드(js/ts/tsx) 변경 커밋 시 lint fix, build, test가 자동 수행됨

## 디렉토리 구조
```
root/
├── frontend/       # 프론트엔드(React + Mantine)
├── backend/        # 백엔드(Node.js + TypeScript)
├── shared/         # 타입, 상수, 공통 유틸리티
├── infrastructure/ # 인프라(AWS CDK)
├── docs/           # 문서
├── scripts/        # 유틸리티 스크립트
```

## 개발/운영 규칙
- 프론트엔드 UI는 실행 코드를 우선 작성, 코어 로직은 TDD
- 백엔드는 TDD 기반 개발
- 커밋 전 tasks.md에 진행상황 반영
- 설계 변경시 requirements.md, design.md 동시 수정
- 커뮤니케이션은 한국어
- 자세한 규칙은 [글로벌 규칙](./global_windsurf_rules.md)과 [워크스페이스 규칙](.windsurfrules) 참조

## 시작하기
각 패키지별 README.md와 docs/ 폴더의 문서를 참고하세요.
