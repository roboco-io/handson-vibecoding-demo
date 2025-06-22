import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { TodoController } from '../../../src/interfaces/rest/todo.controller';
import { TodoUseCase } from '../../../src/domain/todo/todo.usecase';
import { Todo } from '../../../src/domain/todo/todo.entity';
import { mock, MockProxy } from 'jest-mock-extended';

describe('TodoController', () => {
  let todoUseCase: MockProxy<TodoUseCase>;
  let todoController: TodoController;

  beforeEach(() => {
    todoUseCase = mock<TodoUseCase>();
    todoController = new TodoController(todoUseCase);
  });

  describe('create', () => {
    it('should create a todo and return 201 status', async () => {
      const todo = Todo.reconstruct({
        id: '1',
        title: 'Test',
        completed: false,
        userId: 'user1',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      todoUseCase.createTodo.mockResolvedValue(todo);

      const event = {
        body: JSON.stringify({ title: 'Test', userId: 'user1' }),
      } as APIGatewayProxyEvent;

      const result: APIGatewayProxyResult = await todoController.create(event);

      expect(result.statusCode).toBe(201);
      expect(result.body).toEqual(JSON.stringify(todo.toJSON()));
      expect(todoUseCase.createTodo).toHaveBeenCalledWith({ title: 'Test', userId: 'user1' });
    });

    it('should return 400 if body is missing', async () => {
      const event = {} as APIGatewayProxyEvent;
      const result = await todoController.create(event);
      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body).message).toBe('Request body is missing');
    });

    it('should handle invalid JSON in body', async () => {
      const event = { body: 'invalid-json' } as APIGatewayProxyEvent;
      const result = await todoController.create(event);
      expect(result.statusCode).toBe(500);
      expect(JSON.parse(result.body).message).toBe('Error creating todo');
    });

    it('should return 500 on use case error', async () => {
      todoUseCase.createTodo.mockRejectedValue(new Error('DB error'));
      const event = { body: JSON.stringify({ title: 'Test' }) } as APIGatewayProxyEvent;
      const result = await todoController.create(event);
      expect(result.statusCode).toBe(500);
    });
  });

  describe('getById', () => {
    it('should get a todo by id and return 200 status', async () => {
      const todo = Todo.reconstruct({
        id: '1',
        title: 'Test',
        completed: false,
        userId: 'user1',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      todoUseCase.getTodo.mockResolvedValue(todo);

      const event = {
        pathParameters: { id: '1' },
      } as unknown as APIGatewayProxyEvent;

      const result = await todoController.getById(event);

      expect(result.statusCode).toBe(200);
      expect(result.body).toEqual(JSON.stringify(todo.toJSON()));
    });

    it('should return 404 if todo not found', async () => {
      todoUseCase.getTodo.mockResolvedValue(null);
      const event = { pathParameters: { id: '1' } } as unknown as APIGatewayProxyEvent;
      const result = await todoController.getById(event);
      expect(result.statusCode).toBe(404);
    });

    it('should return 400 if id is missing', async () => {
      const event = { pathParameters: {} } as unknown as APIGatewayProxyEvent;
      const result = await todoController.getById(event);
      expect(result.statusCode).toBe(400);
    });

    it('should return 500 on use case error', async () => {
      todoUseCase.getTodo.mockRejectedValue(new Error('DB error'));
      const event = { pathParameters: { id: '1' } } as unknown as APIGatewayProxyEvent;
      const result = await todoController.getById(event);
      expect(result.statusCode).toBe(500);
    });
  });

  describe('getByUserId', () => {
    it('should get todos by user id and return 200 status', async () => {
      const todos = [
        Todo.reconstruct({
          id: '1',
          title: 'Test',
          completed: false,
          userId: 'user1',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ];
      todoUseCase.getUserTodos.mockResolvedValue(todos);

      const event = {
        pathParameters: { userId: 'user1' },
      } as unknown as APIGatewayProxyEvent;

      const result = await todoController.getByUserId(event);

      expect(result.statusCode).toBe(200);
      expect(result.body).toEqual(JSON.stringify(todos.map((t) => t.toJSON())));
    });

    it('should return 400 if userId is missing', async () => {
      const event = { pathParameters: {} } as unknown as APIGatewayProxyEvent;
      const result = await todoController.getByUserId(event);
      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body).message).toBe('User ID is missing');
    });

    it('should return 500 on use case error', async () => {
      todoUseCase.getUserTodos.mockRejectedValue(new Error('DB error'));
      const event = { pathParameters: { userId: 'user1' } } as unknown as APIGatewayProxyEvent;
      const result = await todoController.getByUserId(event);
      expect(result.statusCode).toBe(500);
    });
  });

  describe('update', () => {
    it('should update a todo and return 200 status', async () => {
      const todo = Todo.reconstruct({
        id: '1',
        title: 'Updated',
        completed: true,
        userId: 'user1',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      todoUseCase.updateTodo.mockResolvedValue(todo);

      const event = {
        pathParameters: { id: '1' },
        body: JSON.stringify({ title: 'Updated', completed: true }),
      } as unknown as APIGatewayProxyEvent;

      const result = await todoController.update(event);

      expect(result.statusCode).toBe(200);
      expect(result.body).toEqual(JSON.stringify(todo.toJSON()));
    });

    it('should return 400 if id is missing', async () => {
      const event = {
        pathParameters: {},
        body: JSON.stringify({}),
      } as unknown as APIGatewayProxyEvent;
      const result = await todoController.update(event);
      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body).message).toBe('Todo ID or body is missing');
    });

    it('should return 400 if body is missing', async () => {
      const event = { pathParameters: { id: '1' } } as unknown as APIGatewayProxyEvent;
      const result = await todoController.update(event);
      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body).message).toBe('Todo ID or body is missing');
    });

    it('should handle invalid JSON in body', async () => {
      const event = {
        pathParameters: { id: '1' },
        body: 'invalid-json',
      } as unknown as APIGatewayProxyEvent;
      const result = await todoController.update(event);
      expect(result.statusCode).toBe(500);
      expect(JSON.parse(result.body).message).toBe('Error updating todo');
    });

    it('should return 500 on use case error', async () => {
      todoUseCase.updateTodo.mockRejectedValue(new Error('DB error'));
      const event = { pathParameters: { id: '1' }, body: '{}' } as unknown as APIGatewayProxyEvent;
      const result = await todoController.update(event);
      expect(result.statusCode).toBe(500);
    });
  });

  describe('delete', () => {
    it('should delete a todo and return 204 status', async () => {
      todoUseCase.deleteTodo.mockResolvedValue();

      const event = {
        pathParameters: { id: '1' },
      } as unknown as APIGatewayProxyEvent;

      const result = await todoController.delete(event);

      expect(result.statusCode).toBe(204);
    });

    it('should return 400 if id is missing', async () => {
      const event = { pathParameters: {} } as unknown as APIGatewayProxyEvent;
      const result = await todoController.delete(event);
      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body).message).toBe('Todo ID is missing');
    });

    it('should return 500 on use case error', async () => {
      todoUseCase.deleteTodo.mockRejectedValue(new Error('DB error'));
      const event = { pathParameters: { id: '1' } } as unknown as APIGatewayProxyEvent;
      const result = await todoController.delete(event);
      expect(result.statusCode).toBe(500);
    });
  });
});
