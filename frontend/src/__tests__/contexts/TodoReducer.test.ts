import { Todo, TodoPriority, TodoStatus } from '@vibecoding-demo/shared/src/types/todo';
import { TodoAction, TodoActionType, todoReducer } from '../../contexts/TodoContext';

describe('todoReducer', () => {
  const initialTodo: Todo = {
    id: '1',
    title: '테스트 할일',
    priority: TodoPriority.MEDIUM,
    status: TodoStatus.ACTIVE,
    createdAt: new Date('2025-04-23T10:00:00Z'),
    updatedAt: new Date('2025-04-23T10:00:00Z')
  };

  const initialState: Todo[] = [initialTodo];

  it('ADD_TODO 액션으로 새로운 할일을 추가할 수 있다', () => {
    const newTodo: Omit<Todo, 'id' | 'status' | 'createdAt' | 'updatedAt'> = {
      title: '새로운 할일',
      priority: TodoPriority.HIGH
    };
    
    const action: TodoAction = {
      type: TodoActionType.ADD_TODO,
      payload: newTodo
    };
    
    const newState = todoReducer(initialState, action);
    
    expect(newState.length).toBe(2);
    expect(newState[1].title).toBe('새로운 할일');
    expect(newState[1].priority).toBe(TodoPriority.HIGH);
    expect(newState[1].status).toBe(TodoStatus.ACTIVE);
    expect(newState[1].id).toBeDefined();
    expect(newState[1].createdAt).toBeInstanceOf(Date);
    expect(newState[1].updatedAt).toBeInstanceOf(Date);
  });

  it('UPDATE_TODO 액션으로 기존 할일을 수정할 수 있다', () => {
    const action: TodoAction = {
      type: TodoActionType.UPDATE_TODO,
      payload: {
        id: '1',
        title: '수정된 할일',
        priority: TodoPriority.HIGH
      }
    };
    
    const newState = todoReducer(initialState, action);
    
    expect(newState.length).toBe(1);
    expect(newState[0].id).toBe('1');
    expect(newState[0].title).toBe('수정된 할일');
    expect(newState[0].priority).toBe(TodoPriority.HIGH);
    expect(newState[0].updatedAt).not.toEqual(initialTodo.updatedAt);
  });

  it('DELETE_TODO 액션으로 할일을 삭제할 수 있다', () => {
    const action: TodoAction = {
      type: TodoActionType.DELETE_TODO,
      payload: { id: '1' }
    };
    
    const newState = todoReducer(initialState, action);
    
    expect(newState.length).toBe(0);
  });

  it('TOGGLE_TODO_STATUS 액션으로 할일의 상태를 토글할 수 있다', () => {
    const action: TodoAction = {
      type: TodoActionType.TOGGLE_TODO_STATUS,
      payload: { id: '1' }
    };
    
    const newState = todoReducer(initialState, action);
    
    expect(newState[0].status).toBe(TodoStatus.COMPLETED);
    expect(newState[0].updatedAt).not.toEqual(initialTodo.updatedAt);
    
    // 다시 토글하면 ACTIVE로 돌아가는지 확인
    const newState2 = todoReducer(newState, action);
    expect(newState2[0].status).toBe(TodoStatus.ACTIVE);
  });

  it('CLEAR_COMPLETED_TODOS 액션으로 완료된 할일들을 모두 삭제할 수 있다', () => {
    // 먼저 할일을 완료 상태로 변경
    const toggleAction: TodoAction = {
      type: TodoActionType.TOGGLE_TODO_STATUS,
      payload: { id: '1' }
    };
    
    const stateWithCompletedTodo = todoReducer(initialState, toggleAction);
    
    // 추가 할일 생성
    const addAction: TodoAction = {
      type: TodoActionType.ADD_TODO,
      payload: {
        title: '새로운 할일',
        priority: TodoPriority.LOW
      }
    };
    
    const stateWithMixedTodos = todoReducer(stateWithCompletedTodo, addAction);
    expect(stateWithMixedTodos.length).toBe(2);
    
    // 완료된 할일 삭제
    const clearAction: TodoAction = {
      type: TodoActionType.CLEAR_COMPLETED_TODOS
    };
    
    const finalState = todoReducer(stateWithMixedTodos, clearAction);
    
    expect(finalState.length).toBe(1);
    expect(finalState[0].status).toBe(TodoStatus.ACTIVE);
  });

  it('알 수 없는 액션 타입에 대해서는 상태를 변경하지 않는다', () => {
    const action = {
      type: 'UNKNOWN_ACTION',
      payload: {}
    } as TodoAction;
    
    const newState = todoReducer(initialState, action);
    
    expect(newState).toBe(initialState);
  });
});
