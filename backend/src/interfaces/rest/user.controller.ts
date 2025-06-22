import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { UserUseCase } from '../../domain/user/user.usecase';

export class UserController {
  constructor(private readonly userUseCase: UserUseCase) {}

  async create(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    if (!event.body) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Request body is missing' }) };
    }

    try {
      const { email, name, password } = JSON.parse(event.body);
      const user = await this.userUseCase.createUser({ email, name, password });
      return {
        statusCode: 201,
        body: JSON.stringify(user.toJSON()),
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error creating user', error: errorMessage }),
      };
    }
  }

  async getById(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const id = event.pathParameters?.id;
    if (!id) {
      return { statusCode: 400, body: JSON.stringify({ message: 'User ID is missing' }) };
    }

    try {
      const user = await this.userUseCase.getUser(id);
      if (!user) {
        return { statusCode: 404, body: JSON.stringify({ message: 'User not found' }) };
      }
      return {
        statusCode: 200,
        body: JSON.stringify(user.toJSON()),
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error fetching user', error: errorMessage }),
      };
    }
  }

  async authenticate(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    if (!event.body) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Request body is missing' }) };
    }

    try {
      const { email, password } = JSON.parse(event.body);
      const { token } = await this.userUseCase.authenticateUser(email, password);
      return {
        statusCode: 200,
        body: JSON.stringify({ token }),
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Authentication failed', error: errorMessage }),
      };
    }
  }
}
