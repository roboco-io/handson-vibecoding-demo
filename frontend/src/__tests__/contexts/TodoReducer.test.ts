import { Todo, TodoPriority, TodoStatus } from '@vibecoding-demo/shared/src/types/todo';

// 테스트용 리듀서 액션 타입 정의
type TodoAction =
  | { type: 'LOAD_TODOS'; payload: Todo[] }
  | { type: 'ADD_TODO'; payload: Todo }
  | { type: 'UPDATE_TODO'; payload: Todo }
  | { type: 'DELETE_TODO'; payload: string }
  | { type: 'TOGGLE_TODO_STATUS'; payload: string }
  | { type: 'CLEAR_COMPLETED' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: Error };

// 테스트용 TodoState 인터페이스
interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: Error | null;
}

// 테스트용 리듀서 함수
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

describe('todoReducer', () => {
  const initialTodo: Todo = {
    id: '1',
    title: '테스트 할일',
    priority: TodoPriority.MEDIUM,
    status: TodoStatus.ACTIVE,
    createdAt: new Date('2025-04-23T10:00:00Z'),
    updatedAt: new Date('2025-04-23T10:00:00Z')
  };

  const initialState: TodoState = {
    todos: [initialTodo],
    loading: false,
    error: null
  };

  it('ADD_TODO 액션으로 새로운 할일을 추가할 수 있다', () => {
    const newTodo: Todo = {
      id: '2',
      title: '새로운 할일',
      priority: TodoPriority.HIGH,
      status: TodoStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const action: TodoAction = {
      type: 'ADD_TODO',
      payload: newTodo
    };
    
    const newState = todoReducer(initialState, action);
    
    expect(newState.todos.length).toBe(2);
    expect(newState.todos[1].title).toBe('새로운 할일');
    expect(newState.todos[1].priority).toBe(TodoPriority.HIGH);
    expect(newState.todos[1].status).toBe(TodoStatus.ACTIVE);
    expect(newState.todos[1].id).toBeDefined();
    expect(newState.todos[1].createdAt).toBeInstanceOf(Date);
    expect(newState.todos[1].updatedAt).toBeInstanceOf(Date);
  });

  it('UPDATE_TODO 액션으로 기존 할일을 수정할 수 있다', () => {
    const updatedTodo: Todo = {
      ...initialTodo,
      title: '수정된 할일',
      priority: TodoPriority.HIGH,
      updatedAt: new Date()
    };
    
    const action: TodoAction = {
      type: 'UPDATE_TODO',
      payload: updatedTodo
    };
    
    const newState = todoReducer(initialState, action);
    
    expect(newState.todos.length).toBe(1);
    expect(newState.todos[0].id).toBe('1');
    expect(newState.todos[0].title).toBe('수정된 할일');
    expect(newState.todos[0].priority).toBe(TodoPriority.HIGH);
    expect(newState.todos[0].updatedAt).not.toEqual(initialTodo.updatedAt);
  });

  it('DELETE_TODO 액션으로 할일을 삭제할 수 있다', () => {
    const action: TodoAction = {
      type: 'DELETE_TODO',
      payload: '1'
    };
    
    const newState = todoReducer(initialState, action);
    
    expect(newState.todos.length).toBe(0);
  });

  it('TOGGLE_TODO_STATUS 액션으로 할일의 상태를 토글할 수 있다', () => {
    const action: TodoAction = {
      type: 'TOGGLE_TODO_STATUS',
      payload: '1'
    };
    
    const newState = todoReducer(initialState, action);
    
    expect(newState.todos[0].status).toBe(TodoStatus.COMPLETED);
    expect(newState.todos[0].updatedAt).not.toEqual(initialTodo.updatedAt);
    
    // 다시 토글하면 ACTIVE로 돌아가는지 확인
    const newState2 = todoReducer(newState, action);
    expect(newState2.todos[0].status).toBe(TodoStatus.ACTIVE);
  });

  it('CLEAR_COMPLETED 액션으로 완료된 할일들을 모두 삭제할 수 있다', () => {
    // 먼저 할일을 완료 상태로 변경
    const toggleAction: TodoAction = {
      type: 'TOGGLE_TODO_STATUS',
      payload: '1'
    };
    
    const stateWithCompletedTodo = todoReducer(initialState, toggleAction);
    
    // 추가 할일 생성
    const newTodo: Todo = {
      id: '2',
      title: '새로운 할일',
      priority: TodoPriority.LOW,
      status: TodoStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const addAction: TodoAction = {
      type: 'ADD_TODO',
      payload: newTodo
    };
    
    const stateWithMixedTodos = todoReducer(stateWithCompletedTodo, addAction);
    expect(stateWithMixedTodos.todos.length).toBe(2);
    
    // 완료된 할일 삭제
    const clearAction: TodoAction = {
      type: 'CLEAR_COMPLETED'
    };
    
    const finalState = todoReducer(stateWithMixedTodos, clearAction);
    
    expect(finalState.todos.length).toBe(1);
    expect(finalState.todos[0].status).toBe(TodoStatus.ACTIVE);
  });

  it('알 수 없는 액션 타입에 대해서는 상태를 변경하지 않는다', () => {
    const action = {
      type: 'UNKNOWN_ACTION' as any,
      payload: {}
    };
    
    const newState = todoReducer(initialState, action);
    
    expect(newState).toEqual(initialState);
  });
});
