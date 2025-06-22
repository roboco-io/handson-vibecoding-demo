import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { TodoRepositoryImpl } from '../../../src/infrastructure/dynamodb/todo.repository.impl';
import { Todo, TodoProps } from '../../../src/domain/todo/todo.entity';

const ddbMock = mockClient(DynamoDBDocumentClient);

describe('TodoRepositoryImpl', () => {
  let todoRepository: TodoRepositoryImpl;
  const tableName = 'TestTodoTable';

  beforeEach(() => {
    ddbMock.reset();
    const ddbClient = new DynamoDBClient({});
    const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
    todoRepository = new TodoRepositoryImpl(ddbDocClient, tableName);
  });

  it('should throw an error if table name is not provided', () => {
    const originalEnv = process.env;
    jest.resetModules(); // to re-evaluate modules and process.env
    process.env = { ...originalEnv, TODO_TABLE_NAME: '' };

    const ddbClient = new DynamoDBClient({});
    const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

    expect(() => new TodoRepositoryImpl(ddbDocClient)).toThrow(
      'Table name is not configured. Please set TODO_TABLE_NAME environment variable or pass it to the constructor.',
    );

    process.env = originalEnv; // Restore original environment
  });

  describe('save', () => {
    it('should save a todo item', async () => {
      // Arrange
      const todoProps: TodoProps = {
        id: '1',
        title: 'Test Todo',
        completed: false,
        userId: 'user1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const todo = Todo.reconstruct(todoProps);
      ddbMock.on(PutCommand).resolves({});

      // Act
      await todoRepository.save(todo);

      // Assert
      const putCommand = ddbMock.calls()[0].args[0] as PutCommand;
      expect(putCommand.input.TableName).toEqual(tableName);
      expect(putCommand.input.Item).toEqual(todo.toJSON());
    });
  });

  describe('findById', () => {
    it('should return a todo item if found', async () => {
      // Arrange
      const todoProps: TodoProps = {
        id: '1',
        title: 'Test Todo',
        completed: false,
        userId: 'user1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      ddbMock.on(GetCommand).resolves({ Item: todoProps });

      // Act
      const result = await todoRepository.findById('1');

      // Assert
      expect(result).toBeInstanceOf(Todo);
      expect(result?.id).toEqual('1');
      expect(result?.toJSON()).toEqual(todoProps);
    });

    it('should return null if todo item not found', async () => {
      // Arrange
      ddbMock.on(GetCommand).resolves({ Item: undefined });

      // Act
      const result = await todoRepository.findById('1');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('findByUserId', () => {
    it('should return a list of todo items for a user', async () => {
      // Arrange
      const todosProps: TodoProps[] = [
        {
          id: '1',
          title: 'Test Todo 1',
          completed: false,
          userId: 'user1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          title: 'Test Todo 2',
          completed: true,
          userId: 'user1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      ddbMock.on(QueryCommand).resolves({ Items: todosProps });

      // Act
      const result = await todoRepository.findByUserId('user1');

      // Assert
      expect(result.length).toBe(2);
      expect(result[0]).toBeInstanceOf(Todo);
      expect(result[0].toJSON()).toEqual(todosProps[0]);
    });
  });

  describe('delete', () => {
    it('should delete a todo item', async () => {
      // Arrange
      ddbMock.on(DeleteCommand).resolves({});

      // Act
      await todoRepository.delete('1');

      // Assert
      const deleteCommand = ddbMock.calls()[0].args[0] as DeleteCommand;
      expect(deleteCommand.input.TableName).toEqual(tableName);
      expect(deleteCommand.input.Key).toEqual({ id: '1' });
    });
  });
});
