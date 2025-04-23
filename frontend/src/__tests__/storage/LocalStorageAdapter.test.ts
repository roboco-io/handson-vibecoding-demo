import { Todo, TodoPriority, TodoStatus } from '@vibecoding-demo/shared/src/types/todo';
import { LocalStorageAdapter } from '../../storage/LocalStorageAdapter';

// 로컬 스토리지 모킹
class LocalStorageMock {
  private store: Record<string, string> = {};

  clear() {
    this.store = {};
  }

  getItem(key: string) {
    return this.store[key] || null;
  }

  setItem(key: string, value: string) {
    this.store[key] = String(value);
  }

  removeItem(key: string) {
    delete this.store[key];
  }
}

// 테스트 전에 로컬 스토리지 모킹
Object.defineProperty(window, 'localStorage', {
  value: new LocalStorageMock(),
});

describe('LocalStorageAdapter', () => {
  let storage: LocalStorageAdapter;
  const storageKey = 'todos';

  // 테스트용 Todo 항목
  const todo1: Todo = {
    id: '1',
    title: '첫 번째 할일',
    priority: TodoPriority.HIGH,
    status: TodoStatus.ACTIVE,
    createdAt: new Date('2025-04-23T10:00:00Z'),
    updatedAt: new Date('2025-04-23T10:00:00Z'),
  };

  const todo2: Todo = {
    id: '2',
    title: '두 번째 할일',
    priority: TodoPriority.MEDIUM,
    status: TodoStatus.COMPLETED,
    createdAt: new Date('2025-04-23T11:00:00Z'),
    updatedAt: new Date('2025-04-23T11:00:00Z'),
  };

  beforeEach(() => {
    // 각 테스트 전에 로컬 스토리지 초기화 및 어댑터 생성
    window.localStorage.clear();
    storage = new LocalStorageAdapter(storageKey);
  });

  describe('getAll', () => {
    it('로컬 스토리지가 비어있으면 빈 배열을 반환한다', async () => {
      const todos = await storage.getAll();
      expect(todos).toEqual([]);
    });

    it('로컬 스토리지에 저장된 Todo 항목들을 반환한다', async () => {
      // 로컬 스토리지에 직접 데이터 설정
      window.localStorage.setItem(storageKey, JSON.stringify([todo1, todo2]));

      const todos = await storage.getAll();
      expect(todos).toHaveLength(2);
      expect(todos[0].id).toBe('1');
      expect(todos[1].id).toBe('2');
      
      // Date 객체가 제대로 변환되었는지 확인
      expect(todos[0].createdAt).toBeInstanceOf(Date);
      expect(todos[0].updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('getById', () => {
    it('존재하는 ID의 Todo 항목을 반환한다', async () => {
      // 로컬 스토리지에 직접 데이터 설정
      window.localStorage.setItem(storageKey, JSON.stringify([todo1, todo2]));

      const todo = await storage.getById('1');
      expect(todo).not.toBeNull();
      expect(todo?.id).toBe('1');
      expect(todo?.title).toBe('첫 번째 할일');
      expect(todo?.createdAt).toBeInstanceOf(Date);
    });

    it('존재하지 않는 ID의 경우 null을 반환한다', async () => {
      // 로컬 스토리지에 직접 데이터 설정
      window.localStorage.setItem(storageKey, JSON.stringify([todo1, todo2]));

      const todo = await storage.getById('3');
      expect(todo).toBeNull();
    });
  });

  describe('save', () => {
    it('새로운 Todo 항목을 저장한다', async () => {
      const savedTodo = await storage.save(todo1);
      expect(savedTodo).toEqual(todo1);

      // 로컬 스토리지에 저장되었는지 확인
      const storedData = JSON.parse(window.localStorage.getItem(storageKey) || '[]');
      expect(storedData).toHaveLength(1);
      expect(storedData[0].id).toBe('1');
    });

    it('이미 존재하는 Todo 항목을 업데이트한다', async () => {
      // 로컬 스토리지에 직접 데이터 설정
      window.localStorage.setItem(storageKey, JSON.stringify([todo1, todo2]));

      const updatedTodo = {
        ...todo1,
        title: '업데이트된 할일',
        updatedAt: new Date('2025-04-23T12:00:00Z'),
      };

      const savedTodo = await storage.save(updatedTodo);
      expect(savedTodo).toEqual(updatedTodo);

      // 로컬 스토리지에 업데이트되었는지 확인
      const storedData = JSON.parse(window.localStorage.getItem(storageKey) || '[]');
      expect(storedData).toHaveLength(2);
      expect(storedData[0].title).toBe('업데이트된 할일');
    });
  });

  describe('saveAll', () => {
    it('여러 Todo 항목을 한 번에 저장한다', async () => {
      const todos = [todo1, todo2];
      const savedTodos = await storage.saveAll(todos);
      expect(savedTodos).toEqual(todos);

      // 로컬 스토리지에 저장되었는지 확인
      const storedData = JSON.parse(window.localStorage.getItem(storageKey) || '[]');
      expect(storedData).toHaveLength(2);
    });

    it('기존 데이터를 모두 덮어쓴다', async () => {
      // 로컬 스토리지에 직접 데이터 설정
      window.localStorage.setItem(storageKey, JSON.stringify([todo1]));

      const todos = [todo2];
      await storage.saveAll(todos);

      // 로컬 스토리지에 덮어써졌는지 확인
      const storedData = JSON.parse(window.localStorage.getItem(storageKey) || '[]');
      expect(storedData).toHaveLength(1);
      expect(storedData[0].id).toBe('2');
    });
  });

  describe('remove', () => {
    it('특정 ID의 Todo 항목을 삭제한다', async () => {
      // 로컬 스토리지에 직접 데이터 설정
      window.localStorage.setItem(storageKey, JSON.stringify([todo1, todo2]));

      const result = await storage.remove('1');
      expect(result).toBe(true);

      // 로컬 스토리지에서 삭제되었는지 확인
      const storedData = JSON.parse(window.localStorage.getItem(storageKey) || '[]');
      expect(storedData).toHaveLength(1);
      expect(storedData[0].id).toBe('2');
    });

    it('존재하지 않는 ID의 경우 false를 반환한다', async () => {
      // 로컬 스토리지에 직접 데이터 설정
      window.localStorage.setItem(storageKey, JSON.stringify([todo1, todo2]));

      const result = await storage.remove('3');
      expect(result).toBe(false);

      // 로컬 스토리지에 변화가 없는지 확인
      const storedData = JSON.parse(window.localStorage.getItem(storageKey) || '[]');
      expect(storedData).toHaveLength(2);
    });
  });

  describe('removeAll', () => {
    it('모든 Todo 항목을 삭제한다', async () => {
      // 로컬 스토리지에 직접 데이터 설정
      window.localStorage.setItem(storageKey, JSON.stringify([todo1, todo2]));

      const result = await storage.removeAll();
      expect(result).toBe(true);

      // 로컬 스토리지가 비어있는지 확인
      const storedData = JSON.parse(window.localStorage.getItem(storageKey) || '[]');
      expect(storedData).toHaveLength(0);
    });
  });

  describe('removeCompleted', () => {
    it('완료된 Todo 항목만 삭제한다', async () => {
      // 로컬 스토리지에 직접 데이터 설정
      window.localStorage.setItem(storageKey, JSON.stringify([todo1, todo2]));

      const result = await storage.removeCompleted();
      expect(result).toBe(true);

      // 로컬 스토리지에서 완료된 항목만 삭제되었는지 확인
      const storedData = JSON.parse(window.localStorage.getItem(storageKey) || '[]');
      expect(storedData).toHaveLength(1);
      expect(storedData[0].id).toBe('1');
      expect(storedData[0].status).toBe(TodoStatus.ACTIVE);
    });

    it('완료된 Todo 항목이 없으면 아무것도 삭제하지 않는다', async () => {
      // 활성 상태의 Todo 항목만 설정
      const activeTodo = {
        ...todo2,
        status: TodoStatus.ACTIVE,
      };
      window.localStorage.setItem(storageKey, JSON.stringify([todo1, activeTodo]));

      const result = await storage.removeCompleted();
      expect(result).toBe(true);

      // 로컬 스토리지에 변화가 없는지 확인
      const storedData = JSON.parse(window.localStorage.getItem(storageKey) || '[]');
      expect(storedData).toHaveLength(2);
    });
  });
});
