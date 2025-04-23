import { 
  TodoPriority, 
  TodoStatus, 
  generateTodoId, 
  isValidTodoTitle, 
  createTodoFromInput, 
  sortTodosByPriority,
  filterTodosByStatus
} from '@vibecoding-demo/shared';

describe('Shared 모듈 참조 테스트', () => {
  describe('Todo 타입 참조 테스트', () => {
    it('TodoPriority 열거형을 올바르게 참조해야 함', () => {
      expect(TodoPriority.LOW).toBe('low');
      expect(TodoPriority.MEDIUM).toBe('medium');
      expect(TodoPriority.HIGH).toBe('high');
    });

    it('TodoStatus 열거형을 올바르게 참조해야 함', () => {
      expect(TodoStatus.ACTIVE).toBe('active');
      expect(TodoStatus.COMPLETED).toBe('completed');
    });
  });

  describe('Todo 유틸리티 함수 참조 테스트', () => {
    it('generateTodoId 함수가 올바르게 동작해야 함', () => {
      const id = generateTodoId();
      expect(id).toBeTruthy();
      expect(typeof id).toBe('string');
    });

    it('isValidTodoTitle 함수가 올바르게 동작해야 함', () => {
      expect(isValidTodoTitle('유효한 제목')).toBe(true);
      expect(isValidTodoTitle('')).toBe(false);
    });

    it('createTodoFromInput 함수가 올바르게 동작해야 함', () => {
      const todo = createTodoFromInput({
        title: '테스트 할일',
        priority: TodoPriority.HIGH
      });

      expect(todo.id).toBeTruthy();
      expect(todo.title).toBe('테스트 할일');
      expect(todo.priority).toBe(TodoPriority.HIGH);
      expect(todo.status).toBe(TodoStatus.ACTIVE);
    });

    it('sortTodosByPriority 함수가 올바르게 동작해야 함', () => {
      const now = new Date();
      const todos = [
        {
          id: '1',
          title: '낮은 우선순위',
          priority: TodoPriority.LOW,
          status: TodoStatus.ACTIVE,
          createdAt: now,
          updatedAt: now
        },
        {
          id: '2',
          title: '높은 우선순위',
          priority: TodoPriority.HIGH,
          status: TodoStatus.ACTIVE,
          createdAt: now,
          updatedAt: now
        }
      ];

      const sortedTodos = sortTodosByPriority(todos);
      expect(sortedTodos[0].id).toBe('2'); // HIGH
      expect(sortedTodos[1].id).toBe('1'); // LOW
    });

    it('filterTodosByStatus 함수가 올바르게 동작해야 함', () => {
      const now = new Date();
      const todos = [
        {
          id: '1',
          title: '활성 할일',
          priority: TodoPriority.LOW,
          status: TodoStatus.ACTIVE,
          createdAt: now,
          updatedAt: now
        },
        {
          id: '2',
          title: '완료된 할일',
          priority: TodoPriority.HIGH,
          status: TodoStatus.COMPLETED,
          createdAt: now,
          updatedAt: now
        }
      ];

      const activeTodos = filterTodosByStatus(todos, TodoStatus.ACTIVE);
      expect(activeTodos.length).toBe(1);
      expect(activeTodos[0].id).toBe('1');
    });
  });
});
