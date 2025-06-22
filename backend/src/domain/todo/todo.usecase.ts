import { Todo } from './todo.entity';

export interface CreateTodoInput {
  title: string;
  description?: string;
  userId: string;
}

export interface UpdateTodoInput {
  id: string;
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface TodoUseCase {
  createTodo(input: CreateTodoInput): Promise<Todo>;
  getTodo(id: string): Promise<Todo>;
  getUserTodos(userId: string): Promise<Todo[]>;
  updateTodo(input: UpdateTodoInput): Promise<Todo>;
  deleteTodo(id: string): Promise<void>;
  completeTodo(id: string): Promise<Todo>;
  uncompleteTodo(id: string): Promise<Todo>;
}
