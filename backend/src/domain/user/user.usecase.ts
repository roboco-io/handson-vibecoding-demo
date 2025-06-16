import { User } from './user.entity';

export interface CreateUserInput {
  email: string;
  name: string;
  password: string;
}

export interface UpdateUserInput {
  id: string;
  name?: string;
}

export interface UserUseCase {
  createUser(input: CreateUserInput): Promise<User>;
  getUser(id: string): Promise<User>;
  updateUser(input: UpdateUserInput): Promise<User>;
  deleteUser(id: string): Promise<void>;
  authenticateUser(email: string, password: string): Promise<{ user: User; token: string }>;
} 