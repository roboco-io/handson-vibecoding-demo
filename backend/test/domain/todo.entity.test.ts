import '@jest/globals';
import { Todo } from '../../src/domain/todo/todo.entity';

describe('Todo Entity', () => {
  const mockTodoProps = {
    title: 'Test Todo',
    description: 'Test Description',
    completed: false,
    userId: 'user-123',
  };

  it('should create a new todo', () => {
    const todo = Todo.create(mockTodoProps);

    expect(todo.title).toBe(mockTodoProps.title);
    expect(todo.description).toBe(mockTodoProps.description);
    expect(todo.completed).toBe(mockTodoProps.completed);
    expect(todo.userId).toBe(mockTodoProps.userId);
    expect(todo.id).toBeDefined();
    expect(todo.createdAt).toBeInstanceOf(Date);
    expect(todo.updatedAt).toBeInstanceOf(Date);
  });

  it('should reconstruct a todo from existing props', () => {
    const existingProps = {
      id: 'todo-123',
      title: 'Existing Todo',
      description: 'Existing Description',
      completed: true,
      userId: 'user-123',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const todo = Todo.reconstruct(existingProps);

    expect(todo.id).toBe(existingProps.id);
    expect(todo.title).toBe(existingProps.title);
    expect(todo.description).toBe(existingProps.description);
    expect(todo.completed).toBe(existingProps.completed);
    expect(todo.userId).toBe(existingProps.userId);
    expect(todo.createdAt).toBe(existingProps.createdAt);
    expect(todo.updatedAt).toBe(existingProps.updatedAt);
  });

  it('should complete a todo', () => {
    const todo = Todo.create(mockTodoProps);
    todo.complete();

    expect(todo.completed).toBe(true);
  });

  it('should uncomplete a todo', () => {
    const todo = Todo.create({ ...mockTodoProps, completed: true });
    todo.uncomplete();

    expect(todo.completed).toBe(false);
  });

  it('should update todo title and description', () => {
    const todo = Todo.create(mockTodoProps);
    const newTitle = 'Updated Title';
    const newDescription = 'Updated Description';

    todo.update(newTitle, newDescription);

    expect(todo.title).toBe(newTitle);
    expect(todo.description).toBe(newDescription);
  });

  it('should update todo title and keep description when description is undefined', () => {
    const todo = Todo.create(mockTodoProps);
    const newTitle = 'Updated Title';
    const originalDescription = todo.description;
    todo.update(newTitle, undefined);

    expect(todo.title).toBe(newTitle);
    expect(todo.description).toBe(originalDescription);
  });

  it('should update only title when description is not provided', () => {
    const todo = Todo.create(mockTodoProps);
    const newTitle = 'Updated Title';
    const originalDescription = todo.description;

    todo.update(newTitle);

    expect(todo.title).toBe(newTitle);
    expect(todo.description).toBe(originalDescription);
  });

  it('should convert todo to JSON', () => {
    const todo = Todo.create(mockTodoProps);
    const json = todo.toJSON();

    expect(json).toEqual({
      id: todo.id,
      title: todo.title,
      description: todo.description,
      completed: todo.completed,
      userId: todo.userId,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt,
    });
  });

  it('should return correct values through getters', () => {
    const props = {
      id: 'todo-getter-test',
      title: 'Getter Test',
      description: 'Testing getters',
      completed: false,
      userId: 'user-getter',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const todo = Todo.reconstruct(props);

    expect(todo.id).toBe(props.id);
    expect(todo.title).toBe(props.title);
    expect(todo.description).toBe(props.description);
    expect(todo.completed).toBe(props.completed);
    expect(todo.userId).toBe(props.userId);
    expect(todo.createdAt).toBe(props.createdAt);
    expect(todo.updatedAt).toBe(props.updatedAt);
  });
});
