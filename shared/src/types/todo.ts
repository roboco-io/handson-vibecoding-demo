/**
 * Todo 항목의 우선순위를 나타내는 열거형
 */
export enum TodoPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

/**
 * Todo 항목의 상태를 나타내는 열거형
 */
export enum TodoStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed'
}

/**
 * Todo 항목의 인터페이스
 */
export interface Todo {
  /**
   * Todo 항목의 고유 식별자
   */
  id: string;
  
  /**
   * Todo 항목의 제목
   */
  title: string;
  
  /**
   * Todo 항목의 우선순위
   */
  priority: TodoPriority;
  
  /**
   * Todo 항목의 상태
   */
  status: TodoStatus;
  
  /**
   * Todo 항목의 생성 일시
   */
  createdAt: Date;
  
  /**
   * Todo 항목의 마지막 수정 일시
   */
  updatedAt: Date;
}

/**
 * Todo 항목 생성 시 필요한 데이터 인터페이스
 */
export interface CreateTodoInput {
  title: string;
  priority: TodoPriority;
}

/**
 * Todo 항목 수정 시 필요한 데이터 인터페이스
 */
export interface UpdateTodoInput {
  id: string;
  title?: string;
  priority?: TodoPriority;
  status?: TodoStatus;
}
