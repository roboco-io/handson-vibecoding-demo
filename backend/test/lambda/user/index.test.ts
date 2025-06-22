process.env.USER_TABLE_NAME = 'test-user-table';
process.env.COGNITO_USER_POOL_ID = 'test-pool-id';
process.env.COGNITO_USER_POOL_CLIENT_ID = 'test-client-id';
process.env.AWS_REGION = 'ap-northeast-2';

const mockCreateUser = jest.fn();
const mockGetUser = jest.fn();
const mockAuthenticateUser = jest.fn();

jest.mock('@/interfaces/rest/user.controller', () => ({
  UserController: jest.fn().mockImplementation(() => ({
    create: mockCreateUser,
    getById: mockGetUser,
    authenticate: mockAuthenticateUser,
  })),
}));

describe('User Handler', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let handler: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let UserController: any;

  beforeEach(async () => {
    // Reset mocks
    mockCreateUser.mockClear().mockResolvedValue({ statusCode: 201 });
    mockGetUser.mockClear().mockResolvedValue({ statusCode: 200 });
    mockAuthenticateUser.mockClear().mockResolvedValue({ statusCode: 200 });

    const handlerModule = await import('@/lambda/user/index');
    handler = handlerModule.handler;
    const controllerModule = await import('@/interfaces/rest/user.controller');
    UserController = controllerModule.UserController;
    (UserController as jest.Mock).mockClear();
  });

  it('should route POST /users to UserController.create', async () => {
    const event = { httpMethod: 'POST', path: '/users' };
    await handler(event, {}, () => {});
    expect(mockCreateUser).toHaveBeenCalledWith(event);
  });

  it('should route GET /users/{id} to UserController.getById', async () => {
    const event = { httpMethod: 'GET', path: '/users/123' };
    await handler(event, {}, () => {});
    expect(mockGetUser).toHaveBeenCalledWith(event);
  });

  it('should route POST /auth/token to UserController.authenticate', async () => {
    const event = { httpMethod: 'POST', path: '/auth/token' };
    await handler(event, {}, () => {});
    expect(mockAuthenticateUser).toHaveBeenCalledWith(event);
  });

  it('should return 404 for unknown routes', async () => {
    const event = { httpMethod: 'GET', path: '/unknown' };
    const result = await handler(event, {}, () => {});
    expect(result.statusCode).toBe(404);
  });
});
