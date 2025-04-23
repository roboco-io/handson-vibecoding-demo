import { render, screen, fireEvent } from '@testing-library/react';
import { Todo, TodoPriority, TodoStatus } from '@vibecoding-demo/shared/src/types/todo';
import { TodoProvider, useTodoState, useTodoDispatch } from '../../contexts/TodoContext';

// 테스트용 컴포넌트
const TestComponent = () => {
  const todos = useTodoState();
  const dispatch = useTodoDispatch();

  const addTodo = () => {
    dispatch({
      type: 'ADD_TODO',
      payload: {
        title: '새로운 할일',
        priority: TodoPriority.MEDIUM
      }
    });
  };

  const toggleTodo = (id: string) => {
    dispatch({
      type: 'TOGGLE_TODO_STATUS',
      payload: { id }
    });
  };

  return (
    <div>
      <button data-testid="add-todo" onClick={addTodo}>할일 추가</button>
      <ul>
        {todos.map((todo: Todo) => (
          <li key={todo.id} data-testid={`todo-${todo.id}`}>
            <span>{todo.title}</span>
            <span data-testid={`priority-${todo.id}`}>{todo.priority}</span>
            <span data-testid={`status-${todo.id}`}>{todo.status}</span>
            <button 
              data-testid={`toggle-${todo.id}`} 
              onClick={() => toggleTodo(todo.id)}
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
  const todos = useTodoState();
  return <div>{todos.length}</div>;
};

describe('TodoContext', () => {
  it('TodoProvider 없이 훅을 사용하면 에러가 발생한다', () => {
    // 에러 발생을 콘솔에 출력하지 않도록 설정
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponentWithoutProvider />);
    }).toThrow();
    
    // 콘솔 스파이 복원
    consoleSpy.mockRestore();
  });

  it('TodoProvider로 감싸면 상태와 디스패치 함수에 접근할 수 있다', () => {
    render(
      <TodoProvider>
        <TestComponent />
      </TodoProvider>
    );
    
    expect(screen.getByTestId('todo-count')).toHaveTextContent('0');
  });

  it('할일을 추가하고 상태를 변경할 수 있다', async () => {
    render(
      <TodoProvider>
        <TestComponent />
      </TodoProvider>
    );
    
    // 초기 상태 확인
    expect(screen.getByTestId('todo-count')).toHaveTextContent('0');
    
    // 할일 추가
    await fireEvent.click(screen.getByTestId('add-todo'));
    
    // 할일이 추가되었는지 확인
    expect(screen.getByTestId('todo-count')).toHaveTextContent('1');
    
    // 추가된 할일의 ID 가져오기 (첫 번째 할일)
    const todoElement = screen.getByText('새로운 할일').closest('li');
    const todoId = todoElement?.dataset.testid?.replace('todo-', '') || '';
    
    // 할일 상태 확인
    expect(screen.getByTestId(`status-${todoId}`)).toHaveTextContent(TodoStatus.ACTIVE);
    
    // 할일 상태 토글
    await fireEvent.click(screen.getByTestId(`toggle-${todoId}`));
    
    // 상태가 변경되었는지 확인
    expect(screen.getByTestId(`status-${todoId}`)).toHaveTextContent(TodoStatus.COMPLETED);
  });

  it('초기 상태를 설정할 수 있다', () => {
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
    
    render(
      <TodoProvider initialTodos={initialTodos}>
        <TestComponent />
      </TodoProvider>
    );
    
    // 초기 할일이 렌더링되었는지 확인
    expect(screen.getByTestId('todo-count')).toHaveTextContent('1');
    expect(screen.getByText('초기 할일')).toBeInTheDocument();
    expect(screen.getByTestId('priority-test-id')).toHaveTextContent(TodoPriority.HIGH);
  });
});
