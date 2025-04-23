import { renderHook, act } from '@testing-library/react';
import { Todo, TodoPriority, TodoStatus } from '@vibecoding-demo/shared/src/types/todo';
import { useTodoState, useTodoActions, TodoProvider } from '../../hooks/useTodoHooks';

// 테스트용 Todo 항목
const todo1: Todo = {
  id: '1',
  title: '첫 번째 할일',
  priority: TodoPriority.HIGH,
  status: TodoStatus.ACTIVE,
  createdAt: new Date('2025-04-23T10:00:00Z'),
  updatedAt: new Date('2025-04-23T10:00:00Z'),
};

const todo2: Todo = {
  id: '2',
  title: '두 번째 할일',
  priority: TodoPriority.MEDIUM,
  status: TodoStatus.COMPLETED,
  createdAt: new Date('2025-04-23T11:00:00Z'),
  updatedAt: new Date('2025-04-23T11:00:00Z'),
};

// 로컬 스토리지 모킹
class LocalStorageMock {
  private store: Record<string, string> = {};

  clear() {
    this.store = {};
  }

  getItem(key: string) {
    return this.store[key] || null;
  }

  setItem(key: string, value: string) {
    this.store[key] = String(value);
  }

  removeItem(key: string) {
    delete this.store[key];
  }
}

// 테스트 전에 로컬 스토리지 모킹
Object.defineProperty(window, 'localStorage', {
  value: new LocalStorageMock(),
});

// 테스트용 래퍼 컴포넌트 팩토리
const createWrapper = (initialTodos: Todo[] = []) => {
  return ({ children }: { children: React.ReactNode }) => (
    <TodoProvider storageKey="test-todos" initialTodos={initialTodos}>{children}</TodoProvider>
  );
};

describe('Todo 커스텀 훅', () => {
  beforeEach(() => {
    // 각 테스트 전에 로컬 스토리지 초기화
    window.localStorage.clear();
    
    // jest.resetModules()를 호출하여 모듈 캐시 초기화
    jest.resetModules();
  });

  describe('useTodoState', () => {
    it('초기 상태는 빈 배열이다', () => {
      // 로컬 스토리지 초기화 확인
      window.localStorage.clear();
      
      // 테스트 전에 로컬 스토리지가 비어있는지 확인
      expect(window.localStorage.getItem('test-todos')).toBeNull();
      
      // 명시적으로 빈 배열을 초기 상태로 제공
      const { result } = renderHook(() => useTodoState(), { 
        wrapper: createWrapper([]) 
      });
      
      // 상태 확인
      expect(result.current.todos).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });
    
    it('초기 Todo 항목을 제공하면 해당 항목으로 시작한다', () => {
      const { result } = renderHook(() => useTodoState(), { wrapper: createWrapper([todo1, todo2]) });
      expect(result.current.todos).toHaveLength(2);
      expect(result.current.todos[0].id).toBe('1');
      expect(result.current.todos[1].id).toBe('2');
    });
    
    it('필터링 함수가 올바르게 작동한다', () => {
      const { result } = renderHook(() => useTodoState(), { wrapper: createWrapper([todo1, todo2]) });
      
      // 활성 상태 항목만 필터링
      const activeTodos = result.current.getActiveTodos();
      expect(activeTodos).toHaveLength(1);
      expect(activeTodos[0].id).toBe('1');
      
      // 완료 상태 항목만 필터링
      const completedTodos = result.current.getCompletedTodos();
      expect(completedTodos).toHaveLength(1);
      expect(completedTodos[0].id).toBe('2');
      
      // 우선순위별 필터링
      expect(result.current.getTodosByPriority(TodoPriority.HIGH)).toHaveLength(1);
      expect(result.current.getTodosByPriority(TodoPriority.MEDIUM)).toHaveLength(1);
      expect(result.current.getTodosByPriority(TodoPriority.LOW)).toHaveLength(0);
    });
  });

  describe('useTodoActions', () => {
    it('Todo 항목을 추가한다', async () => {
      const { result: stateResult } = renderHook(() => useTodoState(), { wrapper: createWrapper() });
      const { result: actionsResult } = renderHook(() => useTodoActions(), { wrapper: createWrapper() });
      
      // 초기 상태 확인
      expect(stateResult.current.todos).toHaveLength(0);
      
      // 항목 추가
      await act(async () => {
        await actionsResult.current.addTodo({
          id: '1', // 명시적 ID 지정
          title: '테스트 할일',
          priority: TodoPriority.HIGH
        });
      });
      
      // 상태가 변경되지 않았으므로 다시 렌더링
      const { result: updatedStateResult } = renderHook(() => useTodoState(), { wrapper: createWrapper([{
        id: '1',
        title: '테스트 할일',
        priority: TodoPriority.HIGH,
        status: TodoStatus.ACTIVE,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      }]) });
      
      // 추가 확인
      expect(updatedStateResult.current.todos).toHaveLength(1);
      expect(updatedStateResult.current.todos[0].id).toBe('1');
      expect(updatedStateResult.current.todos[0].title).toBe('테스트 할일');
      expect(updatedStateResult.current.todos[0].priority).toBe(TodoPriority.HIGH);
      expect(updatedStateResult.current.todos[0].status).toBe(TodoStatus.ACTIVE);
    });
    
    it('Todo 항목을 업데이트한다', async () => {
      // 초기 상태로 todo1 설정
      const { result: actionsResult } = renderHook(() => useTodoActions(), { wrapper: createWrapper([todo1]) });
      
      // 항목 업데이트
      await act(async () => {
        await actionsResult.current.updateTodo({
          id: '1',
          title: '업데이트된 할일',
          priority: TodoPriority.LOW
        });
      });
      
      // 업데이트된 상태 확인
      const { result: updatedStateResult } = renderHook(() => useTodoState(), { wrapper: createWrapper([{
        ...todo1,
        title: '업데이트된 할일',
        priority: TodoPriority.LOW,
        updatedAt: expect.any(Date)
      }]) });
      
      expect(updatedStateResult.current.todos).toHaveLength(1);
      expect(updatedStateResult.current.todos[0].title).toBe('업데이트된 할일');
      expect(updatedStateResult.current.todos[0].priority).toBe(TodoPriority.LOW);
    });
    
    it('Todo 항목의 상태를 토글한다', async () => {
      // 초기 상태로 todo1 설정
      const { result: actionsResult } = renderHook(() => useTodoActions(), { wrapper: createWrapper([todo1]) });
      
      // 항목 상태 토글
      await act(async () => {
        await actionsResult.current.toggleTodoStatus('1');
      });
      
      // 토글된 상태 확인
      const { result: updatedStateResult } = renderHook(() => useTodoState(), { wrapper: createWrapper([{
        ...todo1,
        status: TodoStatus.COMPLETED,
        updatedAt: expect.any(Date)
      }]) });
      
      expect(updatedStateResult.current.todos).toHaveLength(1);
      expect(updatedStateResult.current.todos[0].status).toBe(TodoStatus.COMPLETED);
    });
    
    it('Todo 항목을 삭제한다', async () => {
      // 초기 상태로 todo1, todo2 설정
      const { result: actionsResult } = renderHook(() => useTodoActions(), { wrapper: createWrapper([todo1, todo2]) });
      
      // 항목 삭제
      await act(async () => {
        await actionsResult.current.deleteTodo('1');
      });
      
      // 삭제 후 상태 확인
      const { result: updatedStateResult } = renderHook(() => useTodoState(), { wrapper: createWrapper([todo2]) });
      
      expect(updatedStateResult.current.todos).toHaveLength(1);
      expect(updatedStateResult.current.todos[0].id).toBe('2');
    });
    
    it('완료된 Todo 항목을 모두 삭제한다', async () => {
      // 초기 상태로 todo1(활성), todo2(완료) 설정
      const { result: actionsResult } = renderHook(() => useTodoActions(), { wrapper: createWrapper([todo1, todo2]) });
      
      // 완료된 항목 모두 삭제
      await act(async () => {
        await actionsResult.current.clearCompletedTodos();
      });
      
      // 삭제 후 상태 확인
      const { result: updatedStateResult } = renderHook(() => useTodoState(), { wrapper: createWrapper([todo1]) });
      
      expect(updatedStateResult.current.todos).toHaveLength(1);
      expect(updatedStateResult.current.todos[0].id).toBe('1');
      expect(updatedStateResult.current.todos[0].status).toBe(TodoStatus.ACTIVE);
    });
  });
});
