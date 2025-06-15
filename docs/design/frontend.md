# 프론트엔드 설계

## 1. 컴포넌트 구조

Mantine UI Kit 기반으로 컴포넌트를 설계합니다. Mantine의 Card, Checkbox, Select, TextInput, Button, AppShell, Notification 등 주요 컴포넌트를 적극 활용하여 모던하고 일관된 UI/UX를 구현합니다.

![컴포넌트 구조 다이어그램](./images/component-diagram.svg)

## 2. 디렉토리 구조

```
root/
├── frontend/       # 프론트엔드(React + Mantine)
│   └── src/
│       ├── assets/            # 이미지, 아이콘 등 정적 자산
│       ├── components/        # 재사용 가능한 UI 컴포넌트
│       │   ├── common/        # 공통 컴포넌트 (버튼, 입력 필드 등)
│       │   ├── layout/        # 레이아웃 관련 컴포넌트
│       │   └── todo/          # Todo 관련 컴포넌트
│       ├── contexts/          # React Context API
│       ├── hooks/             # 커스텀 훅
│       ├── pages/             # 페이지 컴포넌트
│       ├── services/          # 외부 서비스 통신 로직
│       │   └── storage/       # 로컬 스토리지 관리
│       ├── types/             # TypeScript 타입 정의
│       ├── utils/             # 유틸리티 함수
│       └── App.tsx            # 애플리케이션 진입점
```

## 3. 상태 관리

React Context API와 useReducer를 사용하여 상태 관리를 구현합니다.

```typescript
// Todo 상태 타입 정의
interface Todo {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: string;
}

// Todo 상태 액션 타입
type TodoAction =
  | { type: 'ADD_TODO'; payload: Omit<Todo, 'id' | 'createdAt'> }
  | { type: 'UPDATE_TODO'; payload: Todo }
  | { type: 'DELETE_TODO'; payload: string }
  | { type: 'TOGGLE_TODO'; payload: string }
  | { type: 'SET_TODOS'; payload: Todo[] };

// Todo 상태 리듀서
const todoReducer = (state: Todo[], action: TodoAction): Todo[] => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        {
          id: Date.now().toString(),
          ...action.payload,
          createdAt: new Date().toISOString(),
        },
      ];
    case 'UPDATE_TODO':
      return state.map((todo) =>
        todo.id === action.payload.id ? action.payload : todo
      );
    case 'DELETE_TODO':
      return state.filter((todo) => todo.id !== action.payload);
    case 'TOGGLE_TODO':
      return state.map((todo) =>
        todo.id === action.payload
          ? { ...todo, completed: !todo.completed }
          : todo
      );
    case 'SET_TODOS':
      return action.payload;
    default:
      return state;
  }
};
```

## 4. 스토리지 전략

로컬 스토리지를 사용하여 데이터를 관리합니다.

```typescript
// 스토리지 인터페이스
interface StorageService {
  getTodos(): Promise<Todo[]>;
  saveTodos(todos: Todo[]): Promise<void>;
}

// 로컬 스토리지 구현
class LocalStorageService implements StorageService {
  private readonly STORAGE_KEY = 'todos';

  async getTodos(): Promise<Todo[]> {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  async saveTodos(todos: Todo[]): Promise<void> {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
  }
}
``` 