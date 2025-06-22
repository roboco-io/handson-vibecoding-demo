import { Todo } from './todo.entity';

export interface TodoRepository {
  findById(id: string): Promise<Todo | null>;
  findByUserId(userId: string): Promise<Todo[]>;
  save(todo: Todo): Promise<void>;
  delete(id: string): Promise<void>;
}
