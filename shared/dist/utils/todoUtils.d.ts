import { Todo, TodoStatus, CreateTodoInput } from '../types/todo';
/**
 * 새로운 Todo 항목 ID를 생성합니다.
 * @returns 고유한 ID 문자열
 */
export declare const generateTodoId: () => string;
/**
 * Todo 제목이 유효한지 검증합니다.
 * @param title 검증할 제목
 * @returns 유효성 여부
 */
export declare const isValidTodoTitle: (title: string) => boolean;
/**
 * 우선순위 값이 유효한지 검증합니다.
 * @param priority 검증할 우선순위
 * @returns 유효성 여부
 */
export declare const isValidPriority: (priority: string) => boolean;
/**
 * CreateTodoInput으로부터 새로운 Todo 객체를 생성합니다.
 * @param input Todo 생성 입력 데이터
 * @returns 생성된 Todo 객체
 */
export declare const createTodoFromInput: (input: CreateTodoInput) => Todo;
/**
 * Todo 항목 목록을 우선순위별로 정렬합니다.
 * @param todos 정렬할 Todo 항목 배열
 * @returns 우선순위별로 정렬된 Todo 항목 배열
 */
export declare const sortTodosByPriority: (todos: Todo[]) => Todo[];
/**
 * Todo 항목 목록을 상태별로 필터링합니다.
 * @param todos 필터링할 Todo 항목 배열
 * @param status 필터링할 상태
 * @returns 필터링된 Todo 항목 배열
 */
export declare const filterTodosByStatus: (todos: Todo[], status: TodoStatus) => Todo[];
