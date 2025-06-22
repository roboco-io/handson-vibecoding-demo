import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { UserController } from '@/interfaces/rest/user.controller';
import { UserUseCaseImpl } from '@/application/user/user.usecase.impl';
import { UserRepositoryImpl } from '@/infrastructure/dynamodb/user.repository.impl';
import { AuthRepositoryImpl } from '@/infrastructure/cognito/auth.repository.impl';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';

// Initialize clients and repositories
const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
const cognitoClient = new CognitoIdentityProviderClient({});

const userPoolId = process.env.COGNITO_USER_POOL_ID;
const clientId = process.env.COGNITO_USER_POOL_CLIENT_ID;

if (!userPoolId || !clientId) {
  // This will only fail during runtime if env vars are not set,
  // allowing tests to run without them if the auth repo is mocked.
  console.error('Cognito User Pool ID or Client ID is not configured.');
  // In a real app, you might want to throw an error here to prevent startup.
}

const userRepository = new UserRepositoryImpl(ddbDocClient);
// Use a ternary to handle the case where env vars are not set during test init
const authRepository =
  userPoolId && clientId
    ? new AuthRepositoryImpl(cognitoClient, userPoolId, clientId)
    : ({} as AuthRepositoryImpl);

// Initialize use case and controller
const userUseCase = new UserUseCaseImpl(userRepository, authRepository);
const userController = new UserController(userUseCase);

export const handler = async (
  event: APIGatewayProxyEvent,
  _context: Context,
  _callback: any,
): Promise<APIGatewayProxyResult> => {
  const { httpMethod, path } = event;

  // Router
  if (httpMethod === 'POST' && path === '/users') {
    return userController.create(event);
  }

  const getByIdMatch = path.match(/^\/users\/([^/]+)$/);
  if (httpMethod === 'GET' && getByIdMatch) {
    return userController.getById(event);
  }

  if (httpMethod === 'POST' && path === '/auth/token') {
    return userController.authenticate(event);
  }

  return {
    statusCode: 404,
    body: JSON.stringify({ message: 'Not Found' }),
  };
};
