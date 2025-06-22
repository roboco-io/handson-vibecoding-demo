import {
  type CreateTodoInput,
  type UpdateTodoInput,
  type TodoUseCase,
} from '../../domain/todo/todo.usecase';
import { Todo } from '../../domain/todo/todo.entity';
import { type TodoRepository } from '../../domain/todo/todo.repository';

export class TodoUseCaseImpl implements TodoUseCase {
  constructor(private readonly todoRepository: TodoRepository) {}

  async createTodo(input: CreateTodoInput): Promise<Todo> {
    const todo = Todo.create({
      ...input,
      completed: false,
    });
    await this.todoRepository.save(todo);
    return todo;
  }

  async getTodo(id: string): Promise<Todo | null> {
    return this.todoRepository.findById(id);
  }

  async getUserTodos(userId: string): Promise<Todo[]> {
    return this.todoRepository.findByUserId(userId);
  }

  async updateTodo(input: UpdateTodoInput): Promise<Todo> {
    const todo = await this.getTodo(input.id);
    if (!todo) {
      throw new Error('Todo not found');
    }

    if (input.title) {
      todo.update(input.title, input.description);
    }

    if (input.completed === true) {
      todo.complete();
    } else if (input.completed === false) {
      todo.uncomplete();
    }

    await this.todoRepository.save(todo);
    return todo;
  }

  async deleteTodo(id: string): Promise<void> {
    const todo = await this.getTodo(id); // Check if todo exists before deleting
    if (!todo) {
      throw new Error('Todo not found');
    }
    await this.todoRepository.delete(id);
  }

  async completeTodo(id: string): Promise<Todo> {
    const todo = await this.getTodo(id);
    if (!todo) {
      throw new Error('Todo not found');
    }
    todo.complete();
    await this.todoRepository.save(todo);
    return todo;
  }

  async uncompleteTodo(id: string): Promise<Todo> {
    const todo = await this.getTodo(id);
    if (!todo) {
      throw new Error('Todo not found');
    }
    todo.uncomplete();
    await this.todoRepository.save(todo);
    return todo;
  }
}
