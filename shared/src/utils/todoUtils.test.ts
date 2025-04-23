import { 
  generateTodoId, 
  isValidTodoTitle, 
  isValidPriority, 
  createTodoFromInput,
  sortTodosByPriority,
  filterTodosByStatus
} from './todoUtils';
import { Todo, TodoPriority, TodoStatus, CreateTodoInput } from '../types/todo';
import { MAX_TITLE_LENGTH } from '../constants/todo';

describe('todoUtils', () => {
  describe('generateTodoId', () => {
    it('고유한 ID를 생성해야 함', () => {
      const id1 = generateTodoId();
      const id2 = generateTodoId();
      
      expect(id1).toBeTruthy();
      expect(typeof id1).toBe('string');
      expect(id1).not.toEqual(id2);
    });
  });
  
  describe('isValidTodoTitle', () => {
    it('유효한 제목은 true를 반환해야 함', () => {
      expect(isValidTodoTitle('유효한 제목')).toBe(true);
    });
    
    it('빈 제목은 false를 반환해야 함', () => {
      expect(isValidTodoTitle('')).toBe(false);
      expect(isValidTodoTitle('   ')).toBe(false);
    });
    
    it('최대 길이를 초과하는 제목은 false를 반환해야 함', () => {
      const longTitle = 'a'.repeat(MAX_TITLE_LENGTH + 1);
      expect(isValidTodoTitle(longTitle)).toBe(false);
    });
  });
  
  describe('isValidPriority', () => {
    it('유효한 우선순위는 true를 반환해야 함', () => {
      expect(isValidPriority(TodoPriority.LOW)).toBe(true);
      expect(isValidPriority(TodoPriority.MEDIUM)).toBe(true);
      expect(isValidPriority(TodoPriority.HIGH)).toBe(true);
    });
    
    it('유효하지 않은 우선순위는 false를 반환해야 함', () => {
      expect(isValidPriority('invalid')).toBe(false);
    });
  });
  
  describe('createTodoFromInput', () => {
    it('입력값으로부터 올바른 Todo 객체를 생성해야 함', () => {
      const input: CreateTodoInput = {
        title: '테스트 할일',
        priority: TodoPriority.HIGH
      };
      
      const todo = createTodoFromInput(input);
      
      expect(todo.id).toBeTruthy();
      expect(todo.title).toBe(input.title);
      expect(todo.priority).toBe(input.priority);
      expect(todo.status).toBe(TodoStatus.ACTIVE);
      expect(todo.createdAt).toBeInstanceOf(Date);
      expect(todo.updatedAt).toBeInstanceOf(Date);
    });
    
    it('제목 앞뒤 공백을 제거해야 함', () => {
      const input: CreateTodoInput = {
        title: '  테스트 할일  ',
        priority: TodoPriority.MEDIUM
      };
      
      const todo = createTodoFromInput(input);
      
      expect(todo.title).toBe('테스트 할일');
    });
  });
  
  describe('sortTodosByPriority', () => {
    it('우선순위에 따라 Todo 항목을 정렬해야 함', () => {
      const now = new Date();
      const todos: Todo[] = [
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
        },
        {
          id: '3',
          title: '중간 우선순위',
          priority: TodoPriority.MEDIUM,
          status: TodoStatus.ACTIVE,
          createdAt: now,
          updatedAt: now
        }
      ];
      
      const sortedTodos = sortTodosByPriority(todos);
      
      expect(sortedTodos[0].id).toBe('2'); // HIGH
      expect(sortedTodos[1].id).toBe('3'); // MEDIUM
      expect(sortedTodos[2].id).toBe('1'); // LOW
    });
  });
  
  describe('filterTodosByStatus', () => {
    it('상태에 따라 Todo 항목을 필터링해야 함', () => {
      const now = new Date();
      const todos: Todo[] = [
        {
          id: '1',
          title: '활성 할일 1',
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
        },
        {
          id: '3',
          title: '활성 할일 2',
          priority: TodoPriority.MEDIUM,
          status: TodoStatus.ACTIVE,
          createdAt: now,
          updatedAt: now
        }
      ];
      
      const activeTodos = filterTodosByStatus(todos, TodoStatus.ACTIVE);
      const completedTodos = filterTodosByStatus(todos, TodoStatus.COMPLETED);
      
      expect(activeTodos.length).toBe(2);
      expect(activeTodos[0].id).toBe('1');
      expect(activeTodos[1].id).toBe('3');
      
      expect(completedTodos.length).toBe(1);
      expect(completedTodos[0].id).toBe('2');
    });
  });
});
