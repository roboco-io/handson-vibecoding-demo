import { Todo, TodoStatus } from '@vibecoding-demo/shared/src/types/todo';
import { StorageInterface } from './StorageInterface';

/**
 * 로컬 스토리지 어댑터 클래스
 * StorageInterface를 구현하여 로컬 스토리지에 Todo 항목을 저장, 조회, 수정, 삭제하는 기능을 제공합니다.
 */
export class LocalStorageAdapter implements StorageInterface {
  private readonly storageKey: string;

  /**
   * 로컬 스토리지 어댑터 생성자
   * @param storageKey 로컬 스토리지에 사용할 키
   */
  constructor(storageKey: string = 'todos') {
    this.storageKey = storageKey;
  }

  /**
   * 로컬 스토리지에서 모든 Todo 항목을 가져옵니다.
   * @returns Promise<Todo[]> Todo 항목 배열
   */
  async getAll(): Promise<Todo[]> {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) {
        return [];
      }

      const todos: Todo[] = JSON.parse(data);
      // JSON으로 직렬화되면서 Date 객체가 문자열로 변환되므로, 다시 Date 객체로 변환
      return todos.map(todo => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        updatedAt: new Date(todo.updatedAt)
      }));
    } catch (error) {
      console.error('로컬 스토리지에서 데이터를 가져오는 중 오류 발생:', error);
      return [];
    }
  }

  /**
   * 로컬 스토리지에서 특정 ID의 Todo 항목을 가져옵니다.
   * @param id Todo 항목의 ID
   * @returns Promise<Todo | null> 찾은 Todo 항목 또는 null
   */
  async getById(id: string): Promise<Todo | null> {
    try {
      const todos = await this.getAll();
      const todo = todos.find(todo => todo.id === id);
      return todo || null;
    } catch (error) {
      console.error(`ID ${id}의 Todo 항목을 가져오는 중 오류 발생:`, error);
      return null;
    }
  }

  /**
   * 로컬 스토리지에 Todo 항목을 저장합니다.
   * 이미 존재하는 ID의 경우 업데이트합니다.
   * @param todo 저장할 Todo 항목
   * @returns Promise<Todo> 저장된 Todo 항목
   */
  async save(todo: Todo): Promise<Todo> {
    try {
      const todos = await this.getAll();
      const index = todos.findIndex(t => t.id === todo.id);

      if (index !== -1) {
        // 기존 항목 업데이트
        todos[index] = todo;
      } else {
        // 새 항목 추가
        todos.push(todo);
      }

      localStorage.setItem(this.storageKey, JSON.stringify(todos));
      return todo;
    } catch (error) {
      console.error('Todo 항목을 저장하는 중 오류 발생:', error);
      return todo; // 오류 발생 시에도 원본 객체 반환
    }
  }

  /**
   * 로컬 스토리지에 여러 Todo 항목을 한 번에 저장합니다.
   * 기존 데이터를 모두 덮어씁니다.
   * @param todos 저장할 Todo 항목 배열
   * @returns Promise<Todo[]> 저장된 Todo 항목 배열
   */
  async saveAll(todos: Todo[]): Promise<Todo[]> {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(todos));
      return todos;
    } catch (error) {
      console.error('Todo 항목들을 저장하는 중 오류 발생:', error);
      return todos; // 오류 발생 시에도 원본 배열 반환
    }
  }

  /**
   * 로컬 스토리지에서 특정 ID의 Todo 항목을 삭제합니다.
   * @param id 삭제할 Todo 항목의 ID
   * @returns Promise<boolean> 삭제 성공 여부
   */
  async remove(id: string): Promise<boolean> {
    try {
      const todos = await this.getAll();
      const initialLength = todos.length;
      const filteredTodos = todos.filter(todo => todo.id !== id);

      // 항목이 삭제되지 않았으면 false 반환
      if (filteredTodos.length === initialLength) {
        return false;
      }

      localStorage.setItem(this.storageKey, JSON.stringify(filteredTodos));
      return true;
    } catch (error) {
      console.error(`ID ${id}의 Todo 항목을 삭제하는 중 오류 발생:`, error);
      return false;
    }
  }

  /**
   * 로컬 스토리지에서 모든 Todo 항목을 삭제합니다.
   * @returns Promise<boolean> 삭제 성공 여부
   */
  async removeAll(): Promise<boolean> {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify([]));
      return true;
    } catch (error) {
      console.error('모든 Todo 항목을 삭제하는 중 오류 발생:', error);
      return false;
    }
  }

  /**
   * 로컬 스토리지에서 완료된 Todo 항목만 삭제합니다.
   * @returns Promise<boolean> 삭제 성공 여부
   */
  async removeCompleted(): Promise<boolean> {
    try {
      const todos = await this.getAll();
      const activeTodos = todos.filter(todo => todo.status !== TodoStatus.COMPLETED);
      
      localStorage.setItem(this.storageKey, JSON.stringify(activeTodos));
      return true;
    } catch (error) {
      console.error('완료된 Todo 항목을 삭제하는 중 오류 발생:', error);
      return false;
    }
  }
}
