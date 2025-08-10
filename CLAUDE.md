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

# Test (single file - run from frontend/ directory)
cd frontend && npm test -- ComponentName.test.tsx

# E2E Tests with Playwright (requires dev server running)
cd frontend && npx playwright test

# Lint (with auto-fix)
npm run frontend:lint
```

### Backend
```bash
# Build
npm run backend:build

# Test
npm run backend:test

# Test with watch mode (run from backend/ directory)
cd backend && npm run test:watch

# Test with coverage
cd backend && npm run test:coverage

# Lint
npm run backend:lint

# Format code
cd backend && npm run format
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

# Deploy specific stack (run from backend/ directory)
cd backend && npx cdk deploy TodoAppApiStack

# Destroy resources
npm run cdk:destroy

# CDK diff (check changes before deploy)
cd backend && npx cdk diff
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
- **Structure**: Entity → Repository → UseCase → Controller → Lambda Handler
- **Infrastructure**: AWS CDK stacks (API, Auth, Database, Lambda)
- **Key Directories**:
  - `backend/src/domain/`: Core business entities, repositories (interfaces), and use cases (interfaces)
  - `backend/src/application/`: Use case implementations (business logic)
  - `backend/src/infrastructure/`: External service adapters (DynamoDB, Cognito)
  - `backend/src/interfaces/rest/`: REST API controllers
  - `backend/src/lambda/`: AWS Lambda function entry points
  - `backend/src/main/`: Application composition and handler setup
  - `backend/lib/`: CDK infrastructure stacks (API, Auth, Database, Lambda)
  - `backend/test/`: Mirror structure of src/ for comprehensive test coverage

### Shared Module
- **Purpose**: Common types, constants, and utilities shared between frontend/backend
- **Exports**: TypeScript interfaces, validation utilities, constants

## Common Development Workflows

### Running Tests for Specific Components
```bash
# Frontend: Test single component
cd frontend && npm test -- TodoList.test.tsx

# Backend: Test specific domain
cd backend && npm test -- domain/todo

# Backend: Test with coverage for specific files
cd backend && npm test -- --coverage --collectCoverageFrom="src/domain/todo/**/*.ts"
```

### Local Development with Hot Reload
```bash
# Frontend development server (http://localhost:5173)
npm run frontend:dev

# Backend: Watch mode for tests while developing
cd backend && npm run test:watch
```

### Pre-commit Validation Workflow
The pre-commit hook automatically runs lint, build, and test for changed files. To manually run the same checks:
```bash
# For frontend changes
npm run frontend:lint -- --fix && npm run frontend:build && npm run frontend:test

# For backend changes  
npm run backend:lint -- --fix && npm run backend:build && npm run backend:test
```

## Naming Conventions & Branching Strategy

### File and Directory Naming
- **Files**: Use kebab-case for files: `todo-list.component.tsx`, `user-repository.impl.ts`
- **Directories**: Use kebab-case for directories: `frontend/src/components/`, `backend/src/domain/`
- **Test Files**: Mirror structure with `.test.ts` or `.spec.ts` suffix
- **TypeScript Files**: Use `.ts` for pure TypeScript, `.tsx` for React components

### Code Naming Conventions

#### Frontend (React + TypeScript)
- **Components**: PascalCase - `TodoList`, `MobileNavbar`, `TodoInput`
- **Hooks**: camelCase with `use` prefix - `useTodoHooks`, `useLocalStorage`
- **Context**: PascalCase with `Context` suffix - `TodoContext`, `ThemeContext`
- **Props Interfaces**: PascalCase with `Props` suffix - `TodoItemProps`, `HeaderProps`
- **Constants**: SCREAMING_SNAKE_CASE - `TODO_PRIORITY`, `DEFAULT_THEME`

#### Backend (Clean Architecture)
- **Entities**: PascalCase - `Todo`, `User`
- **Repositories**: PascalCase with `Repository` suffix - `TodoRepository`, `UserRepository`  
- **Use Cases**: PascalCase with `UseCase` suffix - `CreateTodoUseCase`, `GetUserUseCase`
- **Controllers**: PascalCase with `Controller` suffix - `TodoController`, `UserController`
- **Implementations**: PascalCase with `Impl` suffix - `TodoRepositoryImpl`, `AuthRepositoryImpl`

#### Shared Module
- **Types**: PascalCase - `Todo`, `TodoStatus`, `TodoPriority`
- **Interfaces**: PascalCase with `I` prefix when needed - `IStorageAdapter`
- **Enums**: PascalCase - `TodoStatus`, `UserRole`
- **Utilities**: camelCase - `validateTodo`, `formatDate`

### Variable and Function Naming
- **Variables**: camelCase - `currentUser`, `todoList`, `isLoading`
- **Functions**: camelCase - `createTodo`, `validateInput`, `handleSubmit`
- **Boolean Variables**: Use `is`, `has`, `can`, `should` prefixes - `isCompleted`, `hasError`, `canEdit`
- **Event Handlers**: Use `handle` prefix - `handleClick`, `handleInputChange`
- **API Endpoints**: kebab-case - `/api/todos`, `/api/users/:id`

### Git Branching Strategy

#### Branch Types and Naming (GitHub Issues Integration)
```
main                              # Production-ready code
├── feature/                      # New features
│   ├── feature/123-todo-crud-operations
│   ├── feature/124-user-authentication
│   └── feature/125-responsive-design
├── fix/                          # Bug fixes
│   ├── fix/126-todo-validation-error
│   └── fix/127-memory-leak-context
├── refactor/                     # Code refactoring
│   ├── refactor/128-clean-architecture-backend
│   └── refactor/129-component-structure
├── docs/                         # Documentation updates
│   ├── docs/130-api-documentation
│   └── docs/131-setup-guide
├── chore/                        # Maintenance tasks
│   ├── chore/132-dependency-updates
│   └── chore/133-ci-pipeline-setup
└── hotfix/                       # Critical production fixes
    └── hotfix/134-security-vulnerability
```

#### Branch Naming Rules (GitHub Issues Required)
**Format**: `<type>/<issue-number>-<descriptive-name>`

- **Feature Branches**: `feature/<issue-number>-<description>`
  - `feature/123-todo-crud-operations`
  - `feature/124-user-authentication`
  - `feature/125-responsive-mobile-design`

- **Bug Fix Branches**: `fix/<issue-number>-<description>`
  - `fix/126-todo-validation-error`
  - `fix/127-memory-leak-in-context`
  - `fix/128-typescript-build-error`

- **Refactor Branches**: `refactor/<issue-number>-<description>`
  - `refactor/129-clean-architecture-implementation`
  - `refactor/130-component-structure-optimization`

- **Documentation Branches**: `docs/<issue-number>-<description>`
  - `docs/131-api-documentation-update`
  - `docs/132-setup-guide-improvement`

- **Maintenance Branches**: `chore/<issue-number>-<description>`
  - `chore/133-dependency-version-updates`
  - `chore/134-ci-cd-pipeline-setup`

- **Hotfix Branches**: `hotfix/<issue-number>-<description>`
  - `hotfix/135-security-vulnerability`
  - `hotfix/136-production-data-corruption`

#### GitHub Issues Integration Workflow

**Prerequisites**: Every branch must be linked to a GitHub Issue

1. **Create GitHub Issue**: Create issue before starting work
   ```bash
   # Use GitHub CLI or web interface
   gh issue create --title "Implement todo CRUD operations" --body "Detailed description..."
   # Note the issue number (e.g., #123)
   ```

2. **Create Branch**: Always branch from `main` with issue number
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/123-todo-crud-operations
   ```

3. **Work on Branch**: Make commits with issue references
   ```bash
   git add .
   git commit -m "feat: implement todo creation logic

   Implements basic CRUD operations for todo items.
   
   Related to #123"
   ```

4. **Push Branch**: Push to remote repository
   ```bash
   git push -u origin feature/123-todo-crud-operations
   ```

5. **Create Pull Request**: Link to GitHub Issue automatically
   - Title: `feat: Add todo CRUD operations with Clean Architecture (#123)`
   - Description: Include `Closes #123` or `Fixes #123` to auto-close issue
   - Template:
   ```markdown
   ## Description
   Implements todo CRUD operations with Clean Architecture pattern.
   
   ## Changes
   - Add Todo entity with factory methods
   - Implement TodoRepository interface and DynamoDB adapter
   - Create TodoController with RESTful endpoints
   - Add comprehensive test coverage
   
   ## Testing
   - [ ] Unit tests pass (80%+ coverage)
   - [ ] Integration tests pass
   - [ ] E2E tests pass
   - [ ] Manual testing completed
   
   Closes #123
   ```

6. **Merge Strategy**: Squash and merge after approval
   - Squash commits into single commit on main branch
   - Auto-close linked GitHub issue
   - Delete feature branch after merge

#### GitHub Issue Management
- **Issue Templates**: Use templates for consistent issue creation
- **Labels**: Apply appropriate labels (bug, enhancement, documentation, etc.)
- **Milestones**: Group related issues into milestones
- **Assignees**: Assign issues to team members
- **Projects**: Link issues to GitHub Projects for tracking

#### Branch Protection Rules
- **Main Branch**: Protected with required reviews
- **Pre-merge Requirements**: 
  - All CI/CD checks must pass
  - Pre-commit hooks must be satisfied
  - Code review approval required
  - No direct pushes to main allowed

## Development Rules

### Implementation Principles
- **TDD Required**: Write tests first for all business logic (core business logic only)
- **Clean Architecture**: Follow domain-driven design patterns with Entity → Repository → UseCase → Controller → Handler flow
- **SOLID Principles**: Apply object-oriented design principles consistently
- **Simplicity First**: Always prefer simple solutions over complex ones (단순성 우선)
- **DRY Principle**: Avoid code duplication, reuse existing functionality where possible
- **Latest Libraries**: Use latest stable versions of dependencies when possible

### Code Quality Standards
- **TypeScript**: Strict type checking enabled across all workspaces
- **ESLint + Prettier**: Consistent code formatting with auto-fix
- **Test Coverage**: Maintain 80%+ coverage for core logic (enforced by Jest)
- **No Mock Data**: Avoid mock data outside of tests (테스트 외 모의 데이터 금지)
- **Guard Rails**: No mock data in development or production environments
- **Token Efficiency**: Optimize output to minimize token usage without sacrificing clarity

### Frontend-Specific Rules
- **Component Architecture**: Single responsibility, reusable, testable components
- **State Management**: React Context API + useReducer for global state, useState for local state
- **UI Framework**: Mantine UI components with consistent design system
- **Accessibility**: WCAG 2.1 AA compliance required
- **Testing Approach**: Implementation first for UI, TDD only for core business logic

### Backend-Specific Rules
- **RESTful API**: Consistent endpoint naming and proper HTTP methods
- **Clean Architecture Layers**: Strict dependency rules - inner layers don't depend on outer layers
- **DynamoDB Optimization**: Optimized table design and query performance
- **Error Handling**: Standardized error responses and status codes
- **AWS Services**: Lambda, DynamoDB, API Gateway, Cognito integration

### Git Workflow & Commit Standards
- **Never use `--no-verify`**: Pre-commit hooks are mandatory
- **GitHub Issue Reference**: All commits must reference related issue
- **Commit Message Format with Issue Reference**: 
  ```
  <type>: <description>
  
  <detailed description if needed>
  
  Related to #<issue-number>
  ```
- **Commit Types**: feat, fix, docs, style, refactor, test, chore
- **Issue Keywords**: Use `Closes #123`, `Fixes #123`, `Resolves #123` in final commit/PR
- **Atomic Commits**: One logical change per commit
- **Sequential Commits**: docs → refactor → feat → fix (순차적 커밋)
- **Pre-commit Validation**: Automatic lint, build, test for changed files only

#### Commit Message Examples with Issues
```bash
# Feature commit
git commit -m "feat: add todo creation endpoint

Implements POST /api/todos with validation and error handling.
Includes unit tests and integration tests.

Related to #123"

# Bug fix commit  
git commit -m "fix: resolve memory leak in TodoContext

Fixed useEffect cleanup in TodoContext provider.
Added proper dependency array and cleanup function.

Fixes #126"

# Documentation commit
git commit -m "docs: update API documentation

Added endpoint documentation for todo CRUD operations.
Updated OpenAPI schema with new request/response types.

Related to #130"
```

### Refactoring Guidelines
- **Plan & Approve**: Explain refactoring plan and get approval before proceeding
- **Structure Improvement**: Focus on improving code structure, not changing functionality
- **Test Validation**: Ensure all tests pass after refactoring
- **Scope Control**: Keep refactoring scope appropriate and well-defined

### Debugging & Troubleshooting
- **Explain & Approve**: Explain cause and solution before proceeding
- **Add Debug Logs**: Add detailed logging when cause is unclear
- **Research First**: Use Perplexity MCP when unsure about cause/solution
- **Focus on Function**: Proper operation is more important than fixing errors
- **Detailed Analysis**: Add verbose logging for unclear issues
- **Root Cause**: Focus on making things work properly, not just fixing errors

### Language & Documentation
- **Korean Primary**: All communication and documentation in Korean except technical terms
- **English for IaC**: Cloud resource descriptions in infrastructure code should be in English
- **Technical Terms**: Preserve original names for libraries and technical concepts
- **Documentation Updates**: Update docs alongside code changes
- **Code Comments**: Add comments for complex logic and algorithms
- **Synchronized Updates**: Keep documentation in sync with code changes
- **Clarity First**: Prioritize clear documentation over brevity

## Testing Strategy

### Frontend Testing
- **Unit Tests**: Jest + React Testing Library for components and hooks
- **E2E Tests**: Playwright with visual regression testing
- **Test Location**: `frontend/src/__tests__/` and `frontend/e2e/`

### Backend Testing
- **Unit Tests**: Jest for domain entities and use cases
- **Integration Tests**: CDK stack testing
- **Test Location**: `backend/test/` mirrors `backend/src/` structure
- **Coverage Thresholds**: 80% branches, functions, lines, statements (enforced by Jest)
- **TDD Pattern**: Tests are co-located with domain entities (`*.test.ts` files)

## Documentation Structure

The `docs/` directory contains comprehensive project documentation:
- **requirements.md**: Functional and non-functional requirements
- **design/**: Architecture, frontend, backend, infrastructure, security, monitoring, optimization
- **tasks/**: Step-by-step implementation checklists

Always refer to and update relevant documentation when making architectural changes.

## Key Files to Monitor

- **Pre-commit Hook**: `.husky/pre-commit` - Controls validation pipeline (Korean comments)
- **Package Scripts**: Root and workspace `package.json` files - Define all available commands
- **CDK Config**: `backend/cdk.json` - AWS CDK configuration
- **TypeScript Configs**: Multiple `tsconfig.json` files per workspace
- **Test Configs**: `jest.config.js` (backend), `playwright.config.ts` (frontend E2E)
- **Entity Patterns**: `backend/src/domain/*/entity.ts` - Domain entity implementations with static factory methods
- **Repository Patterns**: `backend/src/infrastructure/*/repository.impl.ts` - External service adapters

## Technology Stack & Versions

### Frontend Stack
- **Node.js**: v22.x
- **React**: v19.x  
- **TypeScript**: v5.7.x
- **Vite**: v6.x
- **Mantine UI**: v7.x
- **Jest**: v29.x
- **React Testing Library**: v16.x
- **Playwright**: v1.52.x (E2E Testing)

### Backend Stack
- **Node.js**: v22.x
- **TypeScript**: v5.8.x
- **AWS SDK**: v3.x
- **AWS CDK**: v2.x
- **Jest**: v30.x
- **ts-jest**: v29.x

### AWS Services
- **AWS Lambda**: Serverless compute
- **Amazon DynamoDB**: NoSQL database
- **Amazon API Gateway**: API management
- **Amazon Cognito**: Authentication & user management
- **AWS CDK**: Infrastructure as Code

### Development Tools
- **ESLint**: v9.x with TypeScript support
- **Prettier**: v3.x for code formatting
- **Husky**: v8.x for git hooks
- **Jest**: Testing framework across all workspaces

## Important References

### Design Documentation
- `docs/design/architecture.md`: Overall system architecture
- `docs/design/frontend.md`: Frontend implementation details
- `docs/design/backend.md`: Backend Clean Architecture implementation
- `docs/design/infrastructure.md`: AWS infrastructure setup
- `docs/design/security.md`: Authentication and security patterns
- `docs/design/monitoring.md`: Logging and monitoring setup
- `docs/design/optimization.md`: Performance and cost optimization

### Cursor Rules Integration
The project includes comprehensive Cursor IDE rules in `.cursor/rules/` that define:
- Implementation standards and TDD approach
- Frontend/backend specific development patterns  
- Commit workflow and message standards
- Code quality and debugging guidelines
- Architecture compliance requirements

### Windsurf Rules Integration
The project also incorporates Windsurf development rules from `global_windsurf_rules.md`:
- Business logic must follow TDD approach (테스트 우선 비즈니스 로직)
- SOLID principles and Clean Architecture enforcement
- Simplicity over complexity in all solutions
- No mock data outside testing environments
- Token efficiency without sacrificing clarity
- Mandatory approval process for refactoring and debugging

## Notes

- All communication and documentation should be in Korean except for technical terms and cloud resource descriptions
- This project emphasizes comprehensive documentation and systematic development practices
- Infrastructure code descriptions should be in English for AWS resources
- Pre-commit hooks enforce quality gates automatically - never bypass with `--no-verify`
- Follow the design documents in `docs/design/` for architectural decisions