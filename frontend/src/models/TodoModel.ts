import { Todo, TodoPriority, TodoStatus, generateTodoId } from '@vibecoding-demo/shared';

/**
 * Todo 모델 생성을 위한 입력 인터페이스
 */
export interface TodoModelInput {
  id?: string;
  title: string;
  priority: TodoPriority;
  status?: TodoStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Todo 모델 업데이트를 위한 입력 인터페이스
 */
export interface TodoUpdateInput {
  title?: string;
  priority?: TodoPriority;
}

/**
 * Todo 모델 클래스
 * Todo 항목의 생성, 업데이트, 상태 변경 등의 기능을 제공합니다.
 */
export class TodoModel implements Todo {
  readonly id: string;
  private _title: string;
  private _priority: TodoPriority;
  private _status: TodoStatus;
  readonly createdAt: Date;
  private _updatedAt: Date;

  /**
   * TodoModel 생성자
   * @param input Todo 모델 생성을 위한 입력 데이터
   * @throws {Error} 제목이 비어있는 경우 오류 발생
   */
  constructor(input: TodoModelInput) {
    const trimmedTitle = input.title.trim();
    if (!trimmedTitle) {
      throw new Error('제목은 비어있을 수 없습니다');
    }

    this.id = input.id || generateTodoId();
    this._title = trimmedTitle;
    this._priority = input.priority;
    this._status = input.status || TodoStatus.ACTIVE;
    this.createdAt = input.createdAt || new Date();
    this._updatedAt = input.updatedAt || new Date();
  }

  /**
   * Todo 항목의 제목
   */
  get title(): string {
    return this._title;
  }

  /**
   * Todo 항목의 우선순위
   */
  get priority(): TodoPriority {
    return this._priority;
  }

  /**
   * Todo 항목의 상태
   */
  get status(): TodoStatus {
    return this._status;
  }

  /**
   * Todo 항목의 마지막 수정 일시
   */
  get updatedAt(): Date {
    return this._updatedAt;
  }

  /**
   * Todo 항목의 상태를 토글합니다.
   * ACTIVE -> COMPLETED, COMPLETED -> ACTIVE
   */
  toggleStatus(): void {
    this._status = this._status === TodoStatus.ACTIVE
      ? TodoStatus.COMPLETED
      : TodoStatus.ACTIVE;
    this._updatedAt = new Date();
  }

  /**
   * Todo 항목의 제목과 우선순위를 업데이트합니다.
   * @param input 업데이트할 데이터
   * @throws {Error} 제목이 비어있는 경우 오류 발생
   */
  update(input: TodoUpdateInput): void {
    if (input.title !== undefined) {
      const trimmedTitle = input.title.trim();
      if (!trimmedTitle) {
        throw new Error('제목은 비어있을 수 없습니다');
      }
      this._title = trimmedTitle;
    }

    if (input.priority !== undefined) {
      this._priority = input.priority;
    }

    this._updatedAt = new Date();
  }

  /**
   * Todo 모델을 JSON으로 직렬화 가능한 객체로 변환합니다.
   * @returns JSON으로 직렬화 가능한 객체
   */
  toJSON(): {
    id: string;
    title: string;
    priority: TodoPriority;
    status: TodoStatus;
    createdAt: string;
    updatedAt: string;
  } {
    return {
      id: this.id,
      title: this._title,
      priority: this._priority,
      status: this._status,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString()
    };
  }

  /**
   * JSON 객체로부터 TodoModel 인스턴스를 생성합니다.
   * @param json JSON 객체
   * @returns TodoModel 인스턴스
   */
  static fromJSON(json: {
    id: string;
    title: string;
    priority: TodoPriority;
    status: TodoStatus;
    createdAt: string;
    updatedAt: string;
  }): TodoModel {
    return new TodoModel({
      id: json.id,
      title: json.title,
      priority: json.priority,
      status: json.status,
      createdAt: new Date(json.createdAt),
      updatedAt: new Date(json.updatedAt)
    });
  }
}
