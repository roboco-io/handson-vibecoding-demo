import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { TodoUseCase } from '../../domain/todo/todo.usecase';
import { CreateTodoInput } from '../../domain/todo/todo.usecase';

export class TodoController {
  constructor(private readonly todoUseCase: TodoUseCase) {}

  async create(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Request body is missing' }),
      };
    }

    try {
      const { title, userId, description } = JSON.parse(event.body);
      const createTodoInput: CreateTodoInput = { title, userId, description };
      const todo = await this.todoUseCase.createTodo(createTodoInput);
      return {
        statusCode: 201,
        body: JSON.stringify(todo.toJSON()),
      };
    } catch (error) {
      // Basic error handling, can be improved with a proper error middleware
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error creating todo', error: errorMessage }),
      };
    }
  }

  async getById(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const id = event.pathParameters?.id;
    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Todo ID is missing' }),
      };
    }

    try {
      const todo = await this.todoUseCase.getTodo(id);
      if (!todo) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: 'Todo not found' }),
        };
      }
      return {
        statusCode: 200,
        body: JSON.stringify(todo.toJSON()),
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error fetching todo', error: errorMessage }),
      };
    }
  }

  async getByUserId(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const userId = event.pathParameters?.userId;
    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'User ID is missing' }),
      };
    }

    try {
      const todos = await this.todoUseCase.getUserTodos(userId);
      return {
        statusCode: 200,
        body: JSON.stringify(todos.map((t) => t.toJSON())),
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error fetching todos for user', error: errorMessage }),
      };
    }
  }

  async update(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const id = event.pathParameters?.id;
    if (!id || !event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Todo ID or body is missing' }),
      };
    }

    try {
      const { title, description, completed } = JSON.parse(event.body);
      const updatedTodo = await this.todoUseCase.updateTodo({ id, title, description, completed });
      return {
        statusCode: 200,
        body: JSON.stringify(updatedTodo.toJSON()),
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error updating todo', error: errorMessage }),
      };
    }
  }

  async delete(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const id = event.pathParameters?.id;
    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Todo ID is missing' }),
      };
    }

    try {
      await this.todoUseCase.deleteTodo(id);
      return {
        statusCode: 204,
        body: '',
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error deleting todo', error: errorMessage }),
      };
    }
  }
}
