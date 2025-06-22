import { jest } from '@jest/globals';
import type { UserRepository } from '../../src/domain/user/user.repository';
import { UserUseCaseImpl } from '../../src/application/user/user.usecase.impl';
import { User } from '../../src/domain/user/user.entity';
import type { UserUseCase } from '../../src/domain/user/user.usecase';
import type { AuthRepository } from '../../src/domain/user/auth.repository';

const mockUserRepository: jest.Mocked<UserRepository> = {
  findById: jest.fn(),
  findByEmail: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

const mockAuthRepository: jest.Mocked<AuthRepository> = {
  signUp: jest.fn(),
  signIn: jest.fn(),
};

describe('UserUseCase', () => {
  let userUseCase: UserUseCase;
  let testUser: User;

  beforeEach(() => {
    userUseCase = new UserUseCaseImpl(mockUserRepository, mockAuthRepository);
    jest.clearAllMocks();

    testUser = User.reconstruct({
      id: 'test-id',
      email: 'test@example.com',
      name: 'Test User',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  describe('createUser', () => {
    it('새로운 사용자를 생성해야 한다', async () => {
      // given
      const input = {
        email: 'new@example.com',
        name: 'New User',
        password: 'password123',
      };
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockAuthRepository.signUp.mockResolvedValue({ userId: 'new-user-id' });
      mockUserRepository.save.mockResolvedValue(undefined);

      // when
      const createdUser = await userUseCase.createUser(input);

      // then
      expect(createdUser.email).toBe(input.email);
      expect(createdUser.name).toBe(input.name);
      expect(mockAuthRepository.signUp).toHaveBeenCalledWith(input.email, input.password);
      expect(mockUserRepository.save).toHaveBeenCalledWith(expect.any(User));
    });

    it('이미 존재하는 이메일이면 에러를 던져야 한다', async () => {
      // given
      const input = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      };
      mockUserRepository.findByEmail.mockResolvedValue(testUser);

      // when & then
      await expect(userUseCase.createUser(input)).rejects.toThrow(
        'User with this email already exists',
      );
    });
  });

  describe('getUser', () => {
    it('ID로 사용자를 조회해야 한다', async () => {
      // given
      mockUserRepository.findById.mockResolvedValue(testUser);

      // when
      const foundUser = await userUseCase.getUser('test-id');

      // then
      expect(foundUser).toEqual(testUser);
      expect(mockUserRepository.findById).toHaveBeenCalledWith('test-id');
    });

    it('사용자를 찾지 못하면 에러를 던져야 한다', async () => {
      // given
      mockUserRepository.findById.mockResolvedValue(null);

      // when & then
      await expect(userUseCase.getUser('not-found-id')).rejects.toThrow('User not found');
    });
  });

  describe('updateUser', () => {
    it('사용자 이름을 업데이트해야 한다', async () => {
      // given
      const updateData = { id: 'test-id', name: 'Updated Name' };
      mockUserRepository.findById.mockResolvedValue(testUser);
      mockUserRepository.save.mockResolvedValue(undefined);

      // when
      const updatedUser = await userUseCase.updateUser(updateData);

      // then
      expect(updatedUser.name).toBe(updateData.name);
      expect(mockUserRepository.save).toHaveBeenCalledWith(updatedUser);
    });

    it('업데이트할 이름이 없으면 아무것도 하지 않아야 한다', async () => {
      // given
      const updateData = { id: 'test-id' };
      mockUserRepository.findById.mockResolvedValue(testUser);
      const originalName = testUser.name;

      // when
      const updatedUser = await userUseCase.updateUser(updateData);

      // then
      expect(updatedUser.name).toBe(originalName);
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    it('사용자를 삭제해야 한다', async () => {
      // given
      mockUserRepository.findById.mockResolvedValue(testUser);
      mockUserRepository.delete.mockResolvedValue(undefined);

      // when
      await userUseCase.deleteUser('test-id');

      // then
      expect(mockUserRepository.delete).toHaveBeenCalledWith('test-id');
    });
  });

  describe('authenticateUser', () => {
    it('사용자 인증에 성공하고 토큰을 반환해야 한다', async () => {
      // given
      const email = 'test@example.com';
      const password = 'password123';
      mockUserRepository.findByEmail.mockResolvedValue(testUser);
      mockAuthRepository.signIn.mockResolvedValue('auth-token');

      // when
      const result = await userUseCase.authenticateUser(email, password);

      // then
      expect(result.user).toEqual(testUser);
      expect(result.token).toBe('auth-token');
      expect(mockAuthRepository.signIn).toHaveBeenCalledWith(email, password);
    });

    it('사용자를 찾지 못하면 인증에 실패해야 한다', async () => {
      // given
      mockUserRepository.findByEmail.mockResolvedValue(null);

      // when & then
      await expect(
        userUseCase.authenticateUser('not-found@example.com', 'password'),
      ).rejects.toThrow('Invalid credentials');
    });
  });
});
