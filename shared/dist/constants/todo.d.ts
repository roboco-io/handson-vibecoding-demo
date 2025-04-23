/**
 * Todo 관련 상수 정의
 */
/**
 * 기본 우선순위 값
 */
export declare const DEFAULT_PRIORITY = "medium";
/**
 * 페이지당 기본 Todo 항목 수
 */
export declare const DEFAULT_PAGE_SIZE = 10;
/**
 * Todo 항목 제목 최대 길이
 */
export declare const MAX_TITLE_LENGTH = 100;
/**
 * 로컬 스토리지 키
 */
export declare const LOCAL_STORAGE_KEY = "vibecoding-demo-todos";
/**
 * API 엔드포인트 경로
 */
export declare const API_ENDPOINTS: {
    TODOS: string;
    TODO_BY_ID: (id: string) => string;
};
