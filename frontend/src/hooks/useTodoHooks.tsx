import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { Todo, TodoPriority, TodoStatus } from '@vibecoding-demo/shared/src/types/todo';
import { LocalStorageAdapter } from '../storage/LocalStorageAdapter';

// Todo 상태 타입 정의
interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: Error | null;
}

// Todo 액션 타입 정의
type TodoAction =
  | { type: 'LOAD_TODOS'; payload: Todo[] }
  | { type: 'ADD_TODO'; payload: Todo }
  | { type: 'UPDATE_TODO'; payload: Todo }
  | { type: 'DELETE_TODO'; payload: string }
  | { type: 'TOGGLE_TODO_STATUS'; payload: string }
  | { type: 'CLEAR_COMPLETED' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: Error };

// 초기 상태
const initialState: TodoState = {
  todos: [],
  loading: false,
  error: null,
};

// Todo 리듀서
const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
  switch (action.type) {
    case 'LOAD_TODOS':
      return {
        ...state,
        todos: action.payload,
        loading: false,
      };
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, action.payload],
      };
    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id ? { ...todo, ...action.payload, updatedAt: new Date() } : todo
        ),
      };
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };
    case 'TOGGLE_TODO_STATUS':
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload
            ? {
                ...todo,
                status: todo.status === TodoStatus.ACTIVE ? TodoStatus.COMPLETED : TodoStatus.ACTIVE,
                updatedAt: new Date(),
              }
            : todo
        ),
      };
    case 'CLEAR_COMPLETED':
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.status !== TodoStatus.COMPLETED),
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

// Todo 컨텍스트 타입 정의
interface TodoContextType {
  state: TodoState;
  dispatch: React.Dispatch<TodoAction>;
  storage: LocalStorageAdapter;
}

// Todo 컨텍스트 생성
const TodoContext = createContext<TodoContextType | undefined>(undefined);

// TodoProvider 속성 타입 정의
interface TodoProviderProps {
  children: React.ReactNode;
  storageKey: string;
  initialTodos?: Todo[];
}

// TodoProvider 컴포넌트
export const TodoProvider: React.FC<TodoProviderProps> = ({ children, storageKey, initialTodos = [] }) => {
  // 초기 상태에서 loading을 false로 설정
  const [state, dispatch] = useReducer(todoReducer, {
    ...initialState,
    todos: initialTodos,
    loading: false
  });
  const [storage] = useState(() => new LocalStorageAdapter(storageKey));
  const [initialized, setInitialized] = useState(false);

  // 초기 데이터 로드
  useEffect(() => {
    const loadTodos = async () => {
      // 이미 초기화되었거나 초기 Todo가 제공된 경우 추가 로드 건너뜀
      if (initialized || initialTodos.length > 0) {
        if (initialTodos.length > 0 && !initialized) {
          // 초기 Todo가 제공된 경우 로컬 스토리지에 저장만 하고 상태는 변경하지 않음
          await storage.saveAll(initialTodos);
          setInitialized(true);
        }
        return;
      }

      try {
        // 로컬 스토리지에서 데이터 로드
        const todos = await storage.getAll();
        dispatch({ type: 'LOAD_TODOS', payload: todos });
        setInitialized(true);
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error as Error });
        setInitialized(true);
      }
    };

    loadTodos();
  }, [storage, initialTodos, initialized]);

  // 상태가 변경될 때마다 로컬 스토리지 업데이트
  useEffect(() => {
    const saveTodos = async () => {
      try {
        await storage.saveAll(state.todos);
      } catch (error) {
        console.error('로컬 스토리지 저장 실패:', error);
      }
    };

    // 로딩 중이 아니고 초기화 이후에만 저장
    if (!state.loading && state.todos !== initialState.todos) {
      saveTodos();
    }
  }, [state.todos, storage, state.loading]);

  return (
    <TodoContext.Provider value={{ state, dispatch, storage }}>
      {children}
    </TodoContext.Provider>
  );
};

// Todo 컨텍스트 사용을 위한 훅
const useTodoContext = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodoContext는 TodoProvider 내부에서만 사용할 수 있습니다.');
  }
  return context;
};

// Todo 상태 관리 훅
export const useTodoState = () => {
  const { state } = useTodoContext();

  // 활성 Todo 항목만 필터링
  const getActiveTodos = () => {
    return state.todos.filter((todo) => todo.status === TodoStatus.ACTIVE);
  };

  // 완료된 Todo 항목만 필터링
  const getCompletedTodos = () => {
    return state.todos.filter((todo) => todo.status === TodoStatus.COMPLETED);
  };

  // 우선순위별 Todo 항목 필터링
  const getTodosByPriority = (priority: TodoPriority) => {
    return state.todos.filter((todo) => todo.priority === priority);
  };

  return {
    todos: state.todos,
    loading: state.loading,
    error: state.error,
    getActiveTodos,
    getCompletedTodos,
    getTodosByPriority,
  };
};

// Todo 액션 관리 훅
export const useTodoActions = () => {
  const { dispatch, storage } = useTodoContext();

  // Todo 항목 추가
  const addTodo = async (todoData: Partial<Todo>) => {
    try {
      const now = new Date();
      const newTodo: Todo = {
        id: todoData.id || crypto.randomUUID(),
        title: todoData.title || '',
        priority: todoData.priority || TodoPriority.MEDIUM,
        status: TodoStatus.ACTIVE,
        createdAt: now,
        updatedAt: now,
      };

      const savedTodo = await storage.save(newTodo);
      dispatch({ type: 'ADD_TODO', payload: savedTodo });
      return savedTodo;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error as Error });
      throw error;
    }
  };

  // Todo 항목 업데이트
  const updateTodo = async (todoData: Partial<Todo>) => {
    try {
      if (!todoData.id) {
        throw new Error('Todo ID가 필요합니다.');
      }

      const existingTodo = await storage.getById(todoData.id);
      if (!existingTodo) {
        throw new Error(`ID가 ${todoData.id}인 Todo를 찾을 수 없습니다.`);
      }

      const updatedTodo: Todo = {
        ...existingTodo,
        ...todoData,
        updatedAt: new Date(),
      };

      const savedTodo = await storage.save(updatedTodo);
      dispatch({ type: 'UPDATE_TODO', payload: savedTodo });
      return savedTodo;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error as Error });
      throw error;
    }
  };

  // Todo 항목 상태 토글
  const toggleTodoStatus = async (id: string) => {
    try {
      const existingTodo = await storage.getById(id);
      if (!existingTodo) {
        throw new Error(`ID가 ${id}인 Todo를 찾을 수 없습니다.`);
      }

      const updatedTodo: Todo = {
        ...existingTodo,
        status: existingTodo.status === TodoStatus.ACTIVE ? TodoStatus.COMPLETED : TodoStatus.ACTIVE,
        updatedAt: new Date(),
      };

      const savedTodo = await storage.save(updatedTodo);
      dispatch({ type: 'TOGGLE_TODO_STATUS', payload: id });
      return savedTodo;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error as Error });
      throw error;
    }
  };

  // Todo 항목 삭제
  const deleteTodo = async (id: string) => {
    try {
      const success = await storage.remove(id);
      if (success) {
        dispatch({ type: 'DELETE_TODO', payload: id });
      }
      return success;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error as Error });
      throw error;
    }
  };

  // 완료된 Todo 항목 모두 삭제
  const clearCompletedTodos = async () => {
    try {
      const success = await storage.removeCompleted();
      if (success) {
        dispatch({ type: 'CLEAR_COMPLETED' });
      }
      return success;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error as Error });
      throw error;
    }
  };

  return {
    addTodo,
    updateTodo,
    toggleTodoStatus,
    deleteTodo,
    clearCompletedTodos,
  };
};
