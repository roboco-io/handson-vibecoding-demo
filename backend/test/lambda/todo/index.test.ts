process.env.TODO_TABLE_NAME = 'test-todo-table';
process.env.USER_TABLE_NAME = 'test-user-table';
process.env.AWS_REGION = 'ap-northeast-2';

// Hoisting: Declare mock variables before they are used in jest.mock
const mockCreate = jest.fn();
const mockGetById = jest.fn();
const mockGetByUserId = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();

jest.mock('@/interfaces/rest/todo.controller', () => ({
  TodoController: jest.fn().mockImplementation(() => ({
    create: mockCreate,
    getById: mockGetById,
    getByUserId: mockGetByUserId,
    update: mockUpdate,
    delete: mockDelete,
  })),
}));

describe('Todo Handler', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let handler: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let TodoController: any;

  beforeEach(async () => {
    // Reset mocks before each test
    mockCreate.mockClear().mockResolvedValue({ statusCode: 201 });
    mockGetById.mockClear().mockResolvedValue({ statusCode: 200 });
    mockGetByUserId.mockClear().mockResolvedValue({ statusCode: 200 });
    mockUpdate.mockClear().mockResolvedValue({ statusCode: 200 });
    mockDelete.mockClear().mockResolvedValue({ statusCode: 204 });

    // Use require to control execution order
    const handlerModule = await import('@/lambda/todo/index');
    handler = handlerModule.handler;
    const controllerModule = await import('@/interfaces/rest/todo.controller');
    TodoController = controllerModule.TodoController;
    (TodoController as jest.Mock).mockClear();
  });

  it('should route POST /todos to TodoController.create', async () => {
    const event = { httpMethod: 'POST', path: '/todos' };
    await handler(event, {}, () => {});
    expect(mockCreate).toHaveBeenCalledWith(event);
  });

  it('should route GET /todos/{id} to TodoController.getById', async () => {
    const event = { httpMethod: 'GET', path: '/todos/123' };
    await handler(event, {}, () => {});
    expect(mockGetById).toHaveBeenCalledWith(event);
  });

  it('should route GET /users/{userId}/todos to TodoController.getByUserId', async () => {
    const event = { httpMethod: 'GET', path: '/users/abc/todos' };
    await handler(event, {}, () => {});
    expect(mockGetByUserId).toHaveBeenCalledWith(event);
  });

  it('should route PUT /todos/{id} to TodoController.update', async () => {
    const event = { httpMethod: 'PUT', path: '/todos/123' };
    await handler(event, {}, () => {});
    expect(mockUpdate).toHaveBeenCalledWith(event);
  });

  it('should route DELETE /todos/{id} to TodoController.delete', async () => {
    const event = { httpMethod: 'DELETE', path: '/todos/123' };
    await handler(event, {}, () => {});
    expect(mockDelete).toHaveBeenCalledWith(event);
  });

  it('should return 404 for unknown routes', async () => {
    const event = { httpMethod: 'GET', path: '/unknown' };
    const result = await handler(event, {}, () => {});
    expect(result.statusCode).toBe(404);
    expect(mockCreate).not.toHaveBeenCalled();
    expect(mockGetById).not.toHaveBeenCalled();
  });
});
