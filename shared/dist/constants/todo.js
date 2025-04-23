"use strict";
/**
 * Todo 관련 상수 정의
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_ENDPOINTS = exports.LOCAL_STORAGE_KEY = exports.MAX_TITLE_LENGTH = exports.DEFAULT_PAGE_SIZE = exports.DEFAULT_PRIORITY = void 0;
/**
 * 기본 우선순위 값
 */
exports.DEFAULT_PRIORITY = 'medium';
/**
 * 페이지당 기본 Todo 항목 수
 */
exports.DEFAULT_PAGE_SIZE = 10;
/**
 * Todo 항목 제목 최대 길이
 */
exports.MAX_TITLE_LENGTH = 100;
/**
 * 로컬 스토리지 키
 */
exports.LOCAL_STORAGE_KEY = 'vibecoding-demo-todos';
/**
 * API 엔드포인트 경로
 */
exports.API_ENDPOINTS = {
    TODOS: '/api/todos',
    TODO_BY_ID: (id) => `/api/todos/${id}`
};
