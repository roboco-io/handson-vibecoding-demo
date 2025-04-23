import { Todo } from '@vibecoding-demo/shared/src/types/todo';

/**
 * 스토리지 인터페이스
 * Todo 항목을 저장, 조회, 수정, 삭제하는 기능을 정의합니다.
 */
export interface StorageInterface {
  /**
   * 모든 Todo 항목을 가져옵니다.
   * @returns Promise<Todo[]> Todo 항목 배열
   */
  getAll(): Promise<Todo[]>;

  /**
   * 특정 ID의 Todo 항목을 가져옵니다.
   * @param id Todo 항목의 ID
   * @returns Promise<Todo | null> 찾은 Todo 항목 또는 null
   */
  getById(id: string): Promise<Todo | null>;

  /**
   * 새로운 Todo 항목을 저장합니다.
   * @param todo 저장할 Todo 항목
   * @returns Promise<Todo> 저장된 Todo 항목
   */
  save(todo: Todo): Promise<Todo>;

  /**
   * 여러 Todo 항목을 한 번에 저장합니다.
   * @param todos 저장할 Todo 항목 배열
   * @returns Promise<Todo[]> 저장된 Todo 항목 배열
   */
  saveAll(todos: Todo[]): Promise<Todo[]>;

  /**
   * 특정 ID의 Todo 항목을 삭제합니다.
   * @param id 삭제할 Todo 항목의 ID
   * @returns Promise<boolean> 삭제 성공 여부
   */
  remove(id: string): Promise<boolean>;

  /**
   * 모든 Todo 항목을 삭제합니다.
   * @returns Promise<boolean> 삭제 성공 여부
   */
  removeAll(): Promise<boolean>;

  /**
   * 완료된 Todo 항목만 삭제합니다.
   * @returns Promise<boolean> 삭제 성공 여부
   */
  removeCompleted(): Promise<boolean>;
}
