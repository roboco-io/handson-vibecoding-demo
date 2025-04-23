import { TodoModel } from '../TodoModel';
import { TodoPriority, TodoStatus } from '@vibecoding-demo/shared';

describe('TodoModel', () => {
  describe('생성자', () => {
    it('필수 속성으로 Todo 객체를 생성해야 함', () => {
      const todo = new TodoModel({
        title: '테스트 할일',
        priority: TodoPriority.MEDIUM
      });

      expect(todo.id).toBeDefined();
      expect(todo.title).toBe('테스트 할일');
      expect(todo.priority).toBe(TodoPriority.MEDIUM);
      expect(todo.status).toBe(TodoStatus.ACTIVE);
      expect(todo.createdAt).toBeInstanceOf(Date);
      expect(todo.updatedAt).toBeInstanceOf(Date);
    });

    it('모든 속성으로 Todo 객체를 생성해야 함', () => {
      const now = new Date();
      const id = 'test-id-123';
      
      const todo = new TodoModel({
        id,
        title: '테스트 할일',
        priority: TodoPriority.HIGH,
        status: TodoStatus.COMPLETED,
        createdAt: now,
        updatedAt: now
      });

      expect(todo.id).toBe(id);
      expect(todo.title).toBe('테스트 할일');
      expect(todo.priority).toBe(TodoPriority.HIGH);
      expect(todo.status).toBe(TodoStatus.COMPLETED);
      expect(todo.createdAt).toBe(now);
      expect(todo.updatedAt).toBe(now);
    });

    it('제목 앞뒤 공백을 제거해야 함', () => {
      const todo = new TodoModel({
        title: '  테스트 할일  ',
        priority: TodoPriority.MEDIUM
      });

      expect(todo.title).toBe('테스트 할일');
    });

    it('빈 제목으로 생성 시 오류를 발생시켜야 함', () => {
      expect(() => {
        new TodoModel({
          title: '',
          priority: TodoPriority.MEDIUM
        });
      }).toThrow('제목은 비어있을 수 없습니다');
    });

    it('공백만 있는 제목으로 생성 시 오류를 발생시켜야 함', () => {
      expect(() => {
        new TodoModel({
          title: '   ',
          priority: TodoPriority.MEDIUM
        });
      }).toThrow('제목은 비어있을 수 없습니다');
    });
  });

  describe('메서드', () => {
    it('toggleStatus 메서드가 상태를 토글해야 함', () => {
      const todo = new TodoModel({
        title: '테스트 할일',
        priority: TodoPriority.MEDIUM
      });

      expect(todo.status).toBe(TodoStatus.ACTIVE);
      
      todo.toggleStatus();
      expect(todo.status).toBe(TodoStatus.COMPLETED);
      
      todo.toggleStatus();
      expect(todo.status).toBe(TodoStatus.ACTIVE);
    });

    it('update 메서드가 제목과 우선순위를 업데이트해야 함', () => {
      const todo = new TodoModel({
        title: '테스트 할일',
        priority: TodoPriority.MEDIUM
      });

      // 시간 차이를 만들기 위해 약간의 지연
      jest.useFakeTimers();
      jest.setSystemTime(Date.now() + 1000);

      todo.update({
        title: '수정된 할일',
        priority: TodoPriority.HIGH
      });

      expect(todo.title).toBe('수정된 할일');
      expect(todo.priority).toBe(TodoPriority.HIGH);
      expect(todo.updatedAt.getTime()).toBeGreaterThan(todo.createdAt.getTime());
      
      jest.useRealTimers();
    });

    it('update 메서드가 빈 제목으로 업데이트 시 오류를 발생시켜야 함', () => {
      const todo = new TodoModel({
        title: '테스트 할일',
        priority: TodoPriority.MEDIUM
      });

      expect(() => {
        todo.update({
          title: '',
          priority: TodoPriority.HIGH
        });
      }).toThrow('제목은 비어있을 수 없습니다');
    });

    it('toJSON 메서드가 직렬화 가능한 객체를 반환해야 함', () => {
      const todo = new TodoModel({
        title: '테스트 할일',
        priority: TodoPriority.MEDIUM
      });

      const json = todo.toJSON();
      
      expect(json).toEqual({
        id: todo.id,
        title: todo.title,
        priority: todo.priority,
        status: todo.status,
        createdAt: todo.createdAt.toISOString(),
        updatedAt: todo.updatedAt.toISOString()
      });

      // JSON.stringify가 오류 없이 동작해야 함
      expect(() => JSON.stringify(todo)).not.toThrow();
    });

    it('fromJSON 정적 메서드가 JSON 객체로부터 Todo 모델을 생성해야 함', () => {
      const jsonData = {
        id: 'test-id-123',
        title: '테스트 할일',
        priority: TodoPriority.HIGH,
        status: TodoStatus.COMPLETED,
        createdAt: '2025-04-23T08:00:00.000Z',
        updatedAt: '2025-04-23T08:30:00.000Z'
      };

      const todo = TodoModel.fromJSON(jsonData);
      
      expect(todo).toBeInstanceOf(TodoModel);
      expect(todo.id).toBe(jsonData.id);
      expect(todo.title).toBe(jsonData.title);
      expect(todo.priority).toBe(jsonData.priority);
      expect(todo.status).toBe(jsonData.status);
      expect(todo.createdAt).toBeInstanceOf(Date);
      expect(todo.createdAt.toISOString()).toBe(jsonData.createdAt);
      expect(todo.updatedAt).toBeInstanceOf(Date);
      expect(todo.updatedAt.toISOString()).toBe(jsonData.updatedAt);
    });
  });
});
