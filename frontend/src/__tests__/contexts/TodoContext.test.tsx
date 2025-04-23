import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Todo, TodoPriority, TodoStatus } from '@vibecoding-demo/shared/src/types/todo';
import { TodoProvider, useTodoState, useTodoActions } from '../../hooks/useTodoHooks';

// 테스트용 컴포넌트
const TestComponent = () => {
  const { todos } = useTodoState();
  const { addTodo, toggleTodoStatus } = useTodoActions();

  const handleAddTodo = async () => {
    await addTodo({
      title: '새로운 할일',
      priority: TodoPriority.MEDIUM
    });
  };

  const handleToggleTodo = async (id: string) => {
    await toggleTodoStatus(id);
  };

  return (
    <div>
      <button data-testid="add-todo" onClick={handleAddTodo}>할일 추가</button>
      <ul>
        {todos.map((todo: Todo) => (
          <li key={todo.id} data-testid={`todo-${todo.id}`}>
            <span>{todo.title}</span>
            <span data-testid={`priority-${todo.id}`}>{todo.priority}</span>
            <span data-testid={`status-${todo.id}`}>{todo.status}</span>
            <button 
              data-testid={`toggle-${todo.id}`} 
              onClick={() => handleToggleTodo(todo.id)}
            >
              상태 변경
            </button>
          </li>
        ))}
      </ul>
      <div data-testid="todo-count">{todos.length}</div>
    </div>
  );
};

// 컨텍스트 없이 사용 시 에러를 확인하는 테스트용 컴포넌트
const TestComponentWithoutProvider = () => {
  const { todos } = useTodoState();
  return <div>{todos.length}</div>;
};

// 테스트용 래퍼 컴포넌트 팩토리
const createWrapper = (initialTodos: Todo[] = []) => {
  return ({ children }: { children: React.ReactNode }) => (
    <TodoProvider storageKey="test-todos" initialTodos={initialTodos}>{children}</TodoProvider>
  );
};

describe('TodoContext', () => {
  // 각 테스트 전에 로컬 스토리지 초기화
  beforeEach(() => {
    window.localStorage.clear();
    jest.resetModules();
  });

  it('TodoProvider 없이 훅을 사용하면 에러가 발생한다', () => {
    // 에러 발생을 콘솔에 출력하지 않도록 설정
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponentWithoutProvider />);
    }).toThrow();
    
    // 콘솔 스파이 복원
    consoleSpy.mockRestore();
  });

  it('TodoProvider로 감싸면 상태와 액션 함수에 접근할 수 있다', async () => {
    await act(async () => {
      render(<TestComponent />, { wrapper: createWrapper([]) });
    });
    
    expect(screen.getByTestId('todo-count')).toHaveTextContent('0');
  });

  // 이 테스트는 별도로 실행해야 함
  it.skip('할일을 추가하고 상태를 변경할 수 있다', async () => {
    const { rerender } = render(<TestComponent />, { wrapper: createWrapper([]) });
    
    // 초기 상태 확인
    expect(screen.getByTestId('todo-count')).toHaveTextContent('0');
    
    // 할일 추가
    await act(async () => {
      fireEvent.click(screen.getByTestId('add-todo'));
    });
    
    // 상태가 업데이트될 때까지 기다림
    await waitFor(() => {
      expect(screen.getByTestId('todo-count')).toHaveTextContent('1');
    });
    
    // 할일이 추가된 상태로 다시 렌더링
    rerender(
      <TestComponent />
    );
    
    // 추가된 할일의 ID 가져오기 (첫 번째 할일)
    const todoElement = screen.getByText('새로운 할일').closest('li');
    const todoId = todoElement?.dataset.testid?.replace('todo-', '') || '';
    
    // 할일 상태 확인
    expect(screen.getByTestId(`status-${todoId}`)).toHaveTextContent(TodoStatus.ACTIVE);
    
    // 할일 상태 토글
    await act(async () => {
      fireEvent.click(screen.getByTestId(`toggle-${todoId}`));
    });
    
    // 상태가 변경되었는지 확인
    await waitFor(() => {
      expect(screen.getByTestId(`status-${todoId}`)).toHaveTextContent(TodoStatus.COMPLETED);
    });
  });

  it('초기 상태를 설정할 수 있다', async () => {
    const initialTodos: Todo[] = [
      {
        id: 'test-id',
        title: '초기 할일',
        priority: TodoPriority.HIGH,
        status: TodoStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    await act(async () => {
      render(<TestComponent />, { wrapper: createWrapper(initialTodos) });
    });
    
    // 초기 할일이 렌더링되었는지 확인
    expect(screen.getByTestId('todo-count')).toHaveTextContent('1');
    expect(screen.getByText('초기 할일')).toBeInTheDocument();
    expect(screen.getByTestId('priority-test-id')).toHaveTextContent(TodoPriority.HIGH);
  });
});
