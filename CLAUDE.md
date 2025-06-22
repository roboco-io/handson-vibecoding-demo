# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a modern TODO app monorepo demonstrating best practices for web development and infrastructure automation. The project consists of:

- **Frontend**: React + TypeScript + Vite + Mantine UI
- **Backend**: Node.js + TypeScript with Clean Architecture and TDD
- **Shared**: Common types, constants, and utilities
- **Infrastructure**: AWS CDK for Infrastructure as Code
- **Documentation**: Comprehensive design docs and task checklists

## Development Commands

### Frontend
```bash
# Development
npm run frontend:dev

# Build
npm run frontend:build

# Test
npm run frontend:test

# Lint (with auto-fix)
npm run frontend:lint
```

### Backend
```bash
# Build
npm run backend:build

# Test
npm run backend:test

# Lint
npm run backend:lint
```

### Shared Module
```bash
# Build
npm run shared:build

# Test
npm run shared:test

# Lint
npm run shared:lint
```

### Infrastructure (AWS CDK)
```bash
# Synthesize CloudFormation
npm run cdk:synth

# Deploy to AWS
npm run cdk:deploy

# Destroy resources
npm run cdk:destroy
```

## Architecture

### Frontend Architecture
- **State Management**: React Context API with custom hooks
- **UI Framework**: Mantine UI components
- **Storage**: LocalStorage adapter with interface pattern
- **Testing**: Jest + React Testing Library, Playwright for E2E
- **Key Directories**:
  - `frontend/src/components/`: Reusable UI components
  - `frontend/src/contexts/`: React Context providers
  - `frontend/src/hooks/`: Custom hooks for business logic
  - `frontend/src/models/`: Domain models and business logic
  - `frontend/src/storage/`: Storage abstraction layer

### Backend Architecture
- **Pattern**: Clean Architecture with Domain-Driven Design
- **Structure**: Entity → Repository → UseCase → Lambda handlers
- **Infrastructure**: AWS CDK stacks (API, Auth, Database, Lambda)
- **Key Directories**:
  - `backend/src/domain/`: Core business entities and use cases
  - `backend/src/lambda/`: AWS Lambda function handlers
  - `backend/lib/`: CDK infrastructure stacks

### Shared Module
- **Purpose**: Common types, constants, and utilities shared between frontend/backend
- **Exports**: TypeScript interfaces, validation utilities, constants

## Development Rules

### Implementation Principles
- **TDD Required**: Write tests first for all business logic
- **Clean Architecture**: Follow domain-driven design patterns
- **SOLID Principles**: Apply object-oriented design principles
- **Simplicity**: Always prefer simple solutions over complex ones

### Code Quality Standards
- **TypeScript**: Strict type checking enabled
- **ESLint + Prettier**: Consistent code formatting
- **Test Coverage**: Maintain 80%+ coverage for core logic
- **No Mock Data**: Avoid mock data outside of tests

### Git Workflow
- **Pre-commit Hooks**: Automatic lint, build, and test on commit
- **Hook Scope**: Only runs for changed frontend (.js/.ts/.tsx) and backend (.ts) files
- **Never use `--no-verify`**: All commits must pass validation
- **Commit Messages**: Use clear, consistent format

## Testing Strategy

### Frontend Testing
- **Unit Tests**: Jest + React Testing Library for components and hooks
- **E2E Tests**: Playwright with visual regression testing
- **Test Location**: `frontend/src/__tests__/` and `frontend/e2e/`

### Backend Testing
- **Unit Tests**: Jest for domain entities and use cases
- **Integration Tests**: CDK stack testing
- **Test Location**: `backend/test/` and `backend/src/domain/*.test.ts`

## Documentation Structure

The `docs/` directory contains comprehensive project documentation:
- **requirements.md**: Functional and non-functional requirements
- **design/**: Architecture, frontend, backend, infrastructure, security, monitoring, optimization
- **tasks/**: Step-by-step implementation checklists

Always refer to and update relevant documentation when making architectural changes.

## Key Files to Monitor

- **Pre-commit Hook**: `.husky/pre-commit` - Controls validation pipeline
- **Package Scripts**: `package.json` - Defines all available commands
- **CDK Config**: `backend/cdk.json` - AWS CDK configuration
- **TypeScript Configs**: Multiple `tsconfig.json` files per workspace

## Notes

- All communication and documentation should be in Korean except for technical terms and cloud resource descriptions
- This project emphasizes comprehensive documentation and systematic development practices
- Infrastructure code descriptions should be in English for AWS resources