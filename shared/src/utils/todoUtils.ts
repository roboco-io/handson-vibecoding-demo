import { Todo, TodoPriority, TodoStatus, CreateTodoInput } from '../types/todo';
import { MAX_TITLE_LENGTH } from '../constants/todo';

/**
 * 새로운 Todo 항목 ID를 생성합니다.
 * @returns 고유한 ID 문자열
 */
export const generateTodoId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};

/**
 * Todo 제목이 유효한지 검증합니다.
 * @param title 검증할 제목
 * @returns 유효성 여부
 */
export const isValidTodoTitle = (title: string): boolean => {
  return title.trim().length > 0 && title.length <= MAX_TITLE_LENGTH;
};

/**
 * 우선순위 값이 유효한지 검증합니다.
 * @param priority 검증할 우선순위
 * @returns 유효성 여부
 */
export const isValidPriority = (priority: string): boolean => {
  return Object.values(TodoPriority).includes(priority as TodoPriority);
};

/**
 * CreateTodoInput으로부터 새로운 Todo 객체를 생성합니다.
 * @param input Todo 생성 입력 데이터
 * @returns 생성된 Todo 객체
 */
export const createTodoFromInput = (input: CreateTodoInput): Todo => {
  const now = new Date();
  
  return {
    id: generateTodoId(),
    title: input.title.trim(),
    priority: input.priority || TodoPriority.MEDIUM,
    status: TodoStatus.ACTIVE,
    createdAt: now,
    updatedAt: now
  };
};

/**
 * Todo 항목 목록을 우선순위별로 정렬합니다.
 * @param todos 정렬할 Todo 항목 배열
 * @returns 우선순위별로 정렬된 Todo 항목 배열
 */
export const sortTodosByPriority = (todos: Todo[]): Todo[] => {
  const priorityOrder = {
    [TodoPriority.HIGH]: 1,
    [TodoPriority.MEDIUM]: 2,
    [TodoPriority.LOW]: 3
  };
  
  return [...todos].sort((a, b) => 
    priorityOrder[a.priority] - priorityOrder[b.priority]
  );
};

/**
 * Todo 항목 목록을 상태별로 필터링합니다.
 * @param todos 필터링할 Todo 항목 배열
 * @param status 필터링할 상태
 * @returns 필터링된 Todo 항목 배열
 */
export const filterTodosByStatus = (todos: Todo[], status: TodoStatus): Todo[] => {
  return todos.filter(todo => todo.status === status);
};
