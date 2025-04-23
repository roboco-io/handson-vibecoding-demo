/**
 * Todo 관련 상수 정의
 */

/**
 * 기본 우선순위 값
 */
export const DEFAULT_PRIORITY = 'medium';

/**
 * 페이지당 기본 Todo 항목 수
 */
export const DEFAULT_PAGE_SIZE = 10;

/**
 * Todo 항목 제목 최대 길이
 */
export const MAX_TITLE_LENGTH = 100;

/**
 * 로컬 스토리지 키
 */
export const LOCAL_STORAGE_KEY = 'vibecoding-demo-todos';

/**
 * API 엔드포인트 경로
 */
export const API_ENDPOINTS = {
  TODOS: '/api/todos',
  TODO_BY_ID: (id: string) => `/api/todos/${id}`
};
