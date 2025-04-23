"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterTodosByStatus = exports.sortTodosByPriority = exports.createTodoFromInput = exports.isValidPriority = exports.isValidTodoTitle = exports.generateTodoId = void 0;
const todo_1 = require("../types/todo");
const todo_2 = require("../constants/todo");
/**
 * 새로운 Todo 항목 ID를 생성합니다.
 * @returns 고유한 ID 문자열
 */
const generateTodoId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};
exports.generateTodoId = generateTodoId;
/**
 * Todo 제목이 유효한지 검증합니다.
 * @param title 검증할 제목
 * @returns 유효성 여부
 */
const isValidTodoTitle = (title) => {
    return title.trim().length > 0 && title.length <= todo_2.MAX_TITLE_LENGTH;
};
exports.isValidTodoTitle = isValidTodoTitle;
/**
 * 우선순위 값이 유효한지 검증합니다.
 * @param priority 검증할 우선순위
 * @returns 유효성 여부
 */
const isValidPriority = (priority) => {
    return Object.values(todo_1.TodoPriority).includes(priority);
};
exports.isValidPriority = isValidPriority;
/**
 * CreateTodoInput으로부터 새로운 Todo 객체를 생성합니다.
 * @param input Todo 생성 입력 데이터
 * @returns 생성된 Todo 객체
 */
const createTodoFromInput = (input) => {
    const now = new Date();
    return {
        id: (0, exports.generateTodoId)(),
        title: input.title.trim(),
        priority: input.priority || todo_1.TodoPriority.MEDIUM,
        status: todo_1.TodoStatus.ACTIVE,
        createdAt: now,
        updatedAt: now
    };
};
exports.createTodoFromInput = createTodoFromInput;
/**
 * Todo 항목 목록을 우선순위별로 정렬합니다.
 * @param todos 정렬할 Todo 항목 배열
 * @returns 우선순위별로 정렬된 Todo 항목 배열
 */
const sortTodosByPriority = (todos) => {
    const priorityOrder = {
        [todo_1.TodoPriority.HIGH]: 1,
        [todo_1.TodoPriority.MEDIUM]: 2,
        [todo_1.TodoPriority.LOW]: 3
    };
    return [...todos].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
};
exports.sortTodosByPriority = sortTodosByPriority;
/**
 * Todo 항목 목록을 상태별로 필터링합니다.
 * @param todos 필터링할 Todo 항목 배열
 * @param status 필터링할 상태
 * @returns 필터링된 Todo 항목 배열
 */
const filterTodosByStatus = (todos, status) => {
    return todos.filter(todo => todo.status === status);
};
exports.filterTodosByStatus = filterTodosByStatus;
