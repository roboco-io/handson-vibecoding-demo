import {
  type CreateUserInput,
  type UpdateUserInput,
  type UserUseCase,
} from '../../domain/user/user.usecase';
import { User } from '../../domain/user/user.entity';
import type { UserRepository } from '../../domain/user/user.repository';
import type { AuthRepository } from '../../domain/user/auth.repository';

export class UserUseCaseImpl implements UserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authRepository: AuthRepository,
  ) {}

  async createUser(input: CreateUserInput): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const { userId } = await this.authRepository.signUp(input.email, input.password);

    const user = User.reconstruct({
      id: userId,
      email: input.email,
      name: input.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.userRepository.save(user);
    return user;
  }

  async getUser(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async updateUser(input: UpdateUserInput): Promise<User> {
    const user = await this.getUser(input.id);
    if (input.name) {
      user.updateName(input.name);
      await this.userRepository.save(user);
    }
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    await this.getUser(id);
    await this.userRepository.delete(id);
  }

  async authenticateUser(email: string, password: string): Promise<{ user: User; token: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const token = await this.authRepository.signIn(email, password);

    return { user, token };
  }
}
