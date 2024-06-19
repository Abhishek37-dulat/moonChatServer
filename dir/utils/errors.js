"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseError = exports.ValidationError = exports.NotFoundError = exports.AppError = void 0;
const httpStatuses_1 = __importDefault(require("./httpStatuses"));
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
class NotFoundError extends AppError {
    constructor(message) {
        super(message, httpStatuses_1.default.NOT_FOUND.code);
    }
}
exports.NotFoundError = NotFoundError;
class ValidationError extends AppError {
    constructor(message) {
        super(message, httpStatuses_1.default.BAD_REQUEST.code);
    }
}
exports.ValidationError = ValidationError;
class DatabaseError extends AppError {
    constructor(message) {
        super(message, httpStatuses_1.default.INTERNAL_SERVER_ERROR.code);
    }
}
exports.DatabaseError = DatabaseError;
