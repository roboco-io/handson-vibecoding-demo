import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { UserController } from '../../../src/interfaces/rest/user.controller';
import { UserUseCase } from '../../../src/domain/user/user.usecase';
import { User } from '../../../src/domain/user/user.entity';
import { mock, MockProxy } from 'jest-mock-extended';

describe('UserController', () => {
  let userUseCase: MockProxy<UserUseCase>;
  let userController: UserController;

  beforeEach(() => {
    userUseCase = mock<UserUseCase>();
    userController = new UserController(userUseCase);
  });

  describe('create', () => {
    it('should create a user and return 201 status', async () => {
      const user = User.reconstruct({
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      userUseCase.createUser.mockResolvedValue(user);

      const event = {
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        }),
      } as APIGatewayProxyEvent;

      const result: APIGatewayProxyResult = await userController.create(event);

      expect(result.statusCode).toBe(201);
      expect(result.body).toEqual(JSON.stringify(user.toJSON()));
    });

    it('should return 400 if body is missing', async () => {
      const event = { body: null } as APIGatewayProxyEvent;
      const result = await userController.create(event);
      expect(result.statusCode).toBe(400);
    });

    it('should handle invalid JSON in body', async () => {
      const event = { body: 'invalid-json' } as APIGatewayProxyEvent;
      const result = await userController.create(event);
      expect(result.statusCode).toBe(500);
      expect(JSON.parse(result.body).message).toBe('Error creating user');
    });

    it('should return 500 on use case error', async () => {
      userUseCase.createUser.mockRejectedValue(new Error('DB error'));
      const event = { body: JSON.stringify({}) } as APIGatewayProxyEvent;
      const result = await userController.create(event);
      expect(result.statusCode).toBe(500);
    });
  });

  describe('getById', () => {
    it('should get a user by id and return 200 status', async () => {
      const user = User.reconstruct({
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      userUseCase.getUser.mockResolvedValue(user);

      const event = {
        pathParameters: { id: '1' },
      } as unknown as APIGatewayProxyEvent;

      const result = await userController.getById(event);

      expect(result.statusCode).toBe(200);
      expect(result.body).toEqual(JSON.stringify(user.toJSON()));
    });

    it('should return 400 if id is missing', async () => {
      const event = { pathParameters: {} } as unknown as APIGatewayProxyEvent;
      const result = await userController.getById(event);
      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body).message).toBe('User ID is missing');
    });

    it('should return 404 if user not found', async () => {
      userUseCase.getUser.mockResolvedValue(null);
      const event = { pathParameters: { id: '1' } } as unknown as APIGatewayProxyEvent;
      const result = await userController.getById(event);
      expect(result.statusCode).toBe(404);
    });

    it('should return 500 on use case error', async () => {
      userUseCase.getUser.mockRejectedValue(new Error('DB error'));
      const event = { pathParameters: { id: '1' } } as unknown as APIGatewayProxyEvent;
      const result = await userController.getById(event);
      expect(result.statusCode).toBe(500);
    });
  });

  describe('authenticate', () => {
    it('should authenticate a user and return a token', async () => {
      const user = User.reconstruct({
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const token = 'jwt-token';
      userUseCase.authenticateUser.mockResolvedValue({ user, token });

      const event = {
        body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
      } as APIGatewayProxyEvent;

      const result = await userController.authenticate(event);

      expect(result.statusCode).toBe(200);
      expect(JSON.parse(result.body)).toEqual({ token });
    });

    it('should return 400 if body is missing', async () => {
      const event = { body: null } as APIGatewayProxyEvent;
      const result = await userController.authenticate(event);
      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body).message).toBe('Request body is missing');
    });

    it('should handle invalid JSON in body', async () => {
      const event = { body: 'invalid-json' } as APIGatewayProxyEvent;
      const result = await userController.authenticate(event);
      expect(result.statusCode).toBe(401);
      expect(JSON.parse(result.body).message).toBe('Authentication failed');
    });

    it('should return 401 on authentication failure', async () => {
      userUseCase.authenticateUser.mockRejectedValue(new Error('Invalid credentials'));
      const event = {
        body: JSON.stringify({ email: 'test@example.com', password: 'wrong' }),
      } as APIGatewayProxyEvent;
      const result = await userController.authenticate(event);
      expect(result.statusCode).toBe(401);
    });
  });
});
