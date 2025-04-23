"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoStatus = exports.TodoPriority = void 0;
/**
 * Todo 항목의 우선순위를 나타내는 열거형
 */
var TodoPriority;
(function (TodoPriority) {
    TodoPriority["LOW"] = "low";
    TodoPriority["MEDIUM"] = "medium";
    TodoPriority["HIGH"] = "high";
})(TodoPriority || (exports.TodoPriority = TodoPriority = {}));
/**
 * Todo 항목의 상태를 나타내는 열거형
 */
var TodoStatus;
(function (TodoStatus) {
    TodoStatus["ACTIVE"] = "active";
    TodoStatus["COMPLETED"] = "completed";
})(TodoStatus || (exports.TodoStatus = TodoStatus = {}));
