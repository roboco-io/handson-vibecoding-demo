import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { UserRepositoryImpl } from '../../../src/infrastructure/dynamodb/user.repository.impl';
import { User, UserProps } from '../../../src/domain/user/user.entity';

const ddbMock = mockClient(DynamoDBDocumentClient);

describe('UserRepositoryImpl', () => {
  let userRepository: UserRepositoryImpl;
  const tableName = 'TestUserTable';

  beforeEach(() => {
    ddbMock.reset();
    const ddbClient = new DynamoDBClient({});
    const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
    userRepository = new UserRepositoryImpl(ddbDocClient, tableName);
  });

  it('should throw an error if table name is not provided', () => {
    const originalEnv = process.env;
    jest.resetModules();
    process.env = { ...originalEnv, USER_TABLE_NAME: '' };

    const ddbClient = new DynamoDBClient({});
    const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

    expect(() => new UserRepositoryImpl(ddbDocClient)).toThrow(
      'Table name is not configured. Please set USER_TABLE_NAME environment variable or pass it to the constructor.',
    );

    process.env = originalEnv;
  });

  describe('save', () => {
    it('should save a user item', async () => {
      const userProps: UserProps = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const user = User.reconstruct(userProps);
      ddbMock.on(PutCommand).resolves({});

      await userRepository.save(user);

      const putCommand = ddbMock.calls()[0].args[0] as PutCommand;
      expect(putCommand.input.TableName).toEqual(tableName);
      expect(putCommand.input.Item).toEqual(user.toJSON());
    });
  });

  describe('findById', () => {
    it('should return a user item if found', async () => {
      const userProps: UserProps = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      ddbMock.on(GetCommand).resolves({ Item: userProps });

      const result = await userRepository.findById('1');

      expect(result).toBeInstanceOf(User);
      expect(result?.id).toEqual('1');
      expect(result?.toJSON()).toEqual(userProps);
    });

    it('should return null if user not found', async () => {
      ddbMock.on(GetCommand).resolves({ Item: undefined });
      const result = await userRepository.findById('1');
      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should return a user item if found by email', async () => {
      const userProps: UserProps = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      ddbMock.on(QueryCommand).resolves({ Items: [userProps] });

      const result = await userRepository.findByEmail('test@example.com');

      expect(result).toBeInstanceOf(User);
      expect(result?.email).toEqual('test@example.com');
      expect(result?.toJSON()).toEqual(userProps);
    });

    it('should return null if user not found by email', async () => {
      ddbMock.on(QueryCommand).resolves({ Items: [] });
      const result = await userRepository.findByEmail('test@example.com');
      expect(result).toBeNull();
    });

    it('should return null if Items is undefined', async () => {
      ddbMock.on(QueryCommand).resolves({ Items: undefined });
      const result = await userRepository.findByEmail('test@example.com');
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete a user item', async () => {
      ddbMock.on(DeleteCommand).resolves({});
      await userRepository.delete('1');
      const deleteCommand = ddbMock.calls()[0].args[0] as DeleteCommand;
      expect(deleteCommand.input.TableName).toEqual(tableName);
      expect(deleteCommand.input.Key).toEqual({ id: '1' });
    });
  });
});
