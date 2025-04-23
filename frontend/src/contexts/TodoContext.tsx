import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Todo, TodoStatus, UpdateTodoInput } from '@vibecoding-demo/shared/src/types/todo';
import { v4 as uuidv4 } from 'uuid';

/**
 * Todo 액션 타입 열거형
 */
export enum TodoActionType {
  ADD_TODO = 'ADD_TODO',
  UPDATE_TODO = 'UPDATE_TODO',
  DELETE_TODO = 'DELETE_TODO',
  TOGGLE_TODO_STATUS = 'TOGGLE_TODO_STATUS',
  CLEAR_COMPLETED_TODOS = 'CLEAR_COMPLETED_TODOS'
}

/**
 * Todo 액션 인터페이스
 */
export interface TodoAction {
  type: TodoActionType | string;
  payload?: any;
}

/**
 * Todo 상태 관리를 위한 리듀서 함수
 * @param state 현재 Todo 상태 배열
 * @param action 수행할 액션
 * @returns 새로운 Todo 상태 배열
 */
export const todoReducer = (state: Todo[], action: TodoAction): Todo[] => {
  switch (action.type) {
    case TodoActionType.ADD_TODO: {
      const now = new Date();
      const newTodo: Todo = {
        id: uuidv4(),
        title: action.payload.title,
        priority: action.payload.priority,
        status: TodoStatus.ACTIVE,
        createdAt: now,
        updatedAt: now
      };
      return [...state, newTodo];
    }
    
    case TodoActionType.UPDATE_TODO: {
      const { id, ...updates } = action.payload as UpdateTodoInput;
      return state.map(todo => 
        todo.id === id 
          ? { 
              ...todo, 
              ...updates, 
              updatedAt: new Date() 
            } 
          : todo
      );
    }
    
    case TodoActionType.DELETE_TODO: {
      const { id } = action.payload;
      return state.filter(todo => todo.id !== id);
    }
    
    case TodoActionType.TOGGLE_TODO_STATUS: {
      const { id } = action.payload;
      return state.map(todo => 
        todo.id === id 
          ? { 
              ...todo, 
              status: todo.status === TodoStatus.ACTIVE 
                ? TodoStatus.COMPLETED 
                : TodoStatus.ACTIVE,
              updatedAt: new Date() 
            } 
          : todo
      );
    }
    
    case TodoActionType.CLEAR_COMPLETED_TODOS: {
      return state.filter(todo => todo.status !== TodoStatus.COMPLETED);
    }
    
    default:
      return state;
  }
};

/**
 * Todo 상태를 위한 Context
 */
export const TodoStateContext = createContext<Todo[] | null>(null);

/**
 * Todo 디스패치 함수를 위한 Context
 */
export const TodoDispatchContext = createContext<React.Dispatch<TodoAction> | null>(null);

/**
 * TodoContext 프로바이더 속성 인터페이스
 */
interface TodoProviderProps {
  children: ReactNode;
  initialTodos?: Todo[];
}

/**
 * TodoContext 프로바이더 컴포넌트
 * @param props TodoProviderProps
 * @returns TodoContext 프로바이더 컴포넌트
 */
export const TodoProvider = ({ children, initialTodos = [] }: TodoProviderProps) => {
  const [todos, dispatch] = useReducer(todoReducer, initialTodos);

  return (
    <TodoStateContext.Provider value={todos}>
      <TodoDispatchContext.Provider value={dispatch}>
        {children}
      </TodoDispatchContext.Provider>
    </TodoStateContext.Provider>
  );
};

/**
 * Todo 상태를 사용하기 위한 커스텀 훅
 * @returns Todo 상태 배열
 * @throws TodoStateContext가 Provider 내에서 사용되지 않은 경우 에러 발생
 */
export const useTodoState = (): Todo[] => {
  const context = useContext(TodoStateContext);
  if (context === null) {
    throw new Error('useTodoState must be used within a TodoProvider');
  }
  return context;
};

/**
 * Todo 디스패치 함수를 사용하기 위한 커스텀 훅
 * @returns Todo 디스패치 함수
 * @throws TodoDispatchContext가 Provider 내에서 사용되지 않은 경우 에러 발생
 */
export const useTodoDispatch = (): React.Dispatch<TodoAction> => {
  const context = useContext(TodoDispatchContext);
  if (context === null) {
    throw new Error('useTodoDispatch must be used within a TodoProvider');
  }
  return context;
};

/**
 * 편의를 위해 TodoContext를 하나로 묶어서 내보냄
 */
export const TodoContext = {
  Provider: TodoProvider,
  useTodoState,
  useTodoDispatch
};
