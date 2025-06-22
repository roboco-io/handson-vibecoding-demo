import { jest } from '@jest/globals';
import type { TodoRepository } from '../../src/domain/todo/todo.repository';
import { TodoUseCaseImpl } from '../../src/application/todo/todo.usecase.impl';
import { Todo } from '../../src/domain/todo/todo.entity';
import { type TodoUseCase } from '../../src/domain/todo/todo.usecase';

const mockTodoRepository: jest.Mocked<TodoRepository> = {
  findById: jest.fn(),
  findByUserId: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

describe('TodoUseCase', () => {
  let todoUseCase: TodoUseCase;
  let testTodo: Todo;

  beforeEach(() => {
    todoUseCase = new TodoUseCaseImpl(mockTodoRepository);
    jest.clearAllMocks();

    testTodo = Todo.reconstruct({
      id: 'test-id',
      title: 'Test Todo',
      description: 'Test Description',
      completed: false,
      userId: 'user-id',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  describe('createTodo', () => {
    it('새로운 Todo를 생성해야 한다', async () => {
      // given
      const input = {
        title: 'New Todo',
        description: 'New Description',
        userId: 'user-id',
      };
      mockTodoRepository.save.mockResolvedValue(undefined);

      // when
      const createdTodo = await todoUseCase.createTodo(input);

      // then
      expect(createdTodo).toBeInstanceOf(Todo);
      expect(createdTodo.title).toBe(input.title);
      expect(createdTodo.description).toBe(input.description);
      expect(createdTodo.userId).toBe(input.userId);
      expect(createdTodo.completed).toBe(false);
      expect(mockTodoRepository.save).toHaveBeenCalledWith(createdTodo);
      expect(mockTodoRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('getTodo', () => {
    it('ID로 Todo를 조회해야 한다', async () => {
      // given
      mockTodoRepository.findById.mockResolvedValue(testTodo);

      // when
      const foundTodo = await todoUseCase.getTodo('test-id');

      // then
      expect(foundTodo).toEqual(testTodo);
      expect(mockTodoRepository.findById).toHaveBeenCalledWith('test-id');
      expect(mockTodoRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('ID로 Todo를 찾지 못하면 에러를 던져야 한다', async () => {
      // given
      mockTodoRepository.findById.mockResolvedValue(null);

      // when & then
      await expect(todoUseCase.getTodo('not-found-id')).rejects.toThrow('Todo not found');
    });
  });

  describe('getUserTodos', () => {
    it('사용자 ID로 모든 Todo를 조회해야 한다', async () => {
      // given
      const todos = [testTodo];
      mockTodoRepository.findByUserId.mockResolvedValue(todos);

      // when
      const userTodos = await todoUseCase.getUserTodos('user-id');

      // then
      expect(userTodos).toEqual(todos);
      expect(mockTodoRepository.findByUserId).toHaveBeenCalledWith('user-id');
      expect(mockTodoRepository.findByUserId).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateTodo', () => {
    it('Todo를 업데이트해야 한다', async () => {
      // given
      const updateData = {
        id: 'test-id',
        title: 'Updated Title',
        description: 'Updated Description',
      };
      mockTodoRepository.findById.mockResolvedValue(testTodo);
      mockTodoRepository.save.mockResolvedValue(undefined);

      // when
      const updatedTodo = await todoUseCase.updateTodo(updateData);

      // then
      expect(updatedTodo.title).toBe(updateData.title);
      expect(updatedTodo.description).toBe(updateData.description);
      expect(mockTodoRepository.findById).toHaveBeenCalledWith('test-id');
      expect(mockTodoRepository.save).toHaveBeenCalledWith(expect.any(Todo));
    });

    it('Todo의 completed 상태를 true로 업데이트해야 한다', async () => {
      // given
      const updateData = { id: 'test-id', completed: true };
      mockTodoRepository.findById.mockResolvedValue(testTodo);
      mockTodoRepository.save.mockResolvedValue(undefined);

      // when
      const updatedTodo = await todoUseCase.updateTodo(updateData);

      // then
      expect(updatedTodo.completed).toBe(true);
      expect(mockTodoRepository.findById).toHaveBeenCalledWith('test-id');
      expect(mockTodoRepository.save).toHaveBeenCalledWith(expect.any(Todo));
    });

    it('Todo의 completed 상태를 false로 업데이트해야 한다', async () => {
      // given
      testTodo.complete(); // 먼저 완료 상태로 변경
      const updateData = { id: 'test-id', completed: false };
      mockTodoRepository.findById.mockResolvedValue(testTodo);
      mockTodoRepository.save.mockResolvedValue(undefined);

      // when
      const updatedTodo = await todoUseCase.updateTodo(updateData);

      // then
      expect(updatedTodo.completed).toBe(false);
      expect(mockTodoRepository.findById).toHaveBeenCalledWith('test-id');
      expect(mockTodoRepository.save).toHaveBeenCalledWith(expect.any(Todo));
    });

    it('업데이트할 Todo를 찾지 못하면 에러를 던져야 한다', async () => {
      // given
      const updateData = { id: 'not-found-id', title: 'Updated Title' };
      mockTodoRepository.findById.mockResolvedValue(null);

      // when & then
      await expect(todoUseCase.updateTodo(updateData)).rejects.toThrow('Todo not found');
    });
  });

  describe('deleteTodo', () => {
    it('Todo를 삭제해야 한다', async () => {
      // given
      mockTodoRepository.findById.mockResolvedValue(testTodo);
      mockTodoRepository.delete.mockResolvedValue(undefined);

      // when
      await todoUseCase.deleteTodo('test-id');

      // then
      expect(mockTodoRepository.delete).toHaveBeenCalledWith('test-id');
      expect(mockTodoRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('삭제할 Todo를 찾지 못하면 에러를 던져야 한다', async () => {
      // given
      mockTodoRepository.findById.mockResolvedValue(null);

      // when & then
      await expect(todoUseCase.deleteTodo('not-found-id')).rejects.toThrow('Todo not found');
    });
  });

  describe('completeTodo', () => {
    it('Todo를 완료 상태로 변경해야 한다', async () => {
      // given
      mockTodoRepository.findById.mockResolvedValue(testTodo);
      mockTodoRepository.save.mockResolvedValue(undefined);

      // when
      const completedTodo = await todoUseCase.completeTodo('test-id');

      // then
      expect(completedTodo.completed).toBe(true);
      expect(mockTodoRepository.save).toHaveBeenCalledWith(completedTodo);
    });
  });

  describe('uncompleteTodo', () => {
    it('Todo를 미완료 상태로 변경해야 한다', async () => {
      // given
      testTodo.complete(); // 먼저 완료 상태로 변경
      mockTodoRepository.findById.mockResolvedValue(testTodo);
      mockTodoRepository.save.mockResolvedValue(undefined);

      // when
      const uncompletedTodo = await todoUseCase.uncompleteTodo('test-id');

      // then
      expect(uncompletedTodo.completed).toBe(false);
      expect(mockTodoRepository.save).toHaveBeenCalledWith(uncompletedTodo);
    });
  });
});
