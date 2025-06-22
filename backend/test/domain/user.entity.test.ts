import '@jest/globals';
import { User } from '../../src/domain/user/user.entity';

describe('User Entity', () => {
  const mockUserProps = {
    email: 'test@example.com',
    name: 'Test User',
  };

  it('should create a new user', () => {
    const user = User.create(mockUserProps);

    expect(user.email).toBe(mockUserProps.email);
    expect(user.name).toBe(mockUserProps.name);
    expect(user.id).toBeDefined();
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
  });

  it('should reconstruct a user from existing props', () => {
    const existingProps = {
      id: 'user-123',
      email: 'existing@example.com',
      name: 'Existing User',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const user = User.reconstruct(existingProps);

    expect(user.id).toBe(existingProps.id);
    expect(user.email).toBe(existingProps.email);
    expect(user.name).toBe(existingProps.name);
    expect(user.createdAt).toBe(existingProps.createdAt);
    expect(user.updatedAt).toBe(existingProps.updatedAt);
  });

  it('should update user name', () => {
    const user = User.create(mockUserProps);
    const newName = 'Updated Name';

    user.updateName(newName);

    expect(user.name).toBe(newName);
  });

  it('should convert user to JSON', () => {
    const user = User.create(mockUserProps);
    const json = user.toJSON();

    expect(json).toEqual({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  });

  it('should return correct values through getters', () => {
    const props = {
      id: 'user-getter-test',
      email: 'getter@example.com',
      name: 'Getter User',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const user = User.reconstruct(props);

    expect(user.id).toBe(props.id);
    expect(user.email).toBe(props.email);
    expect(user.name).toBe(props.name);
    expect(user.createdAt).toBe(props.createdAt);
    expect(user.updatedAt).toBe(props.updatedAt);
  });
});
