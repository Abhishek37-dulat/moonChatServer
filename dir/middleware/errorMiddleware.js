"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../utils/logger"));
const httpStatuses_1 = __importDefault(require("../utils/httpStatuses"));
const errorHandler = (err, req, res, next) => {
    logger_1.default.error(`${err.status} - ${err.message}`);
    if (!err.isOperational) {
        err.statusCode = httpStatuses_1.default.INTERNAL_SERVER_ERROR.code;
        err.message = httpStatuses_1.default.INTERNAL_SERVER_ERROR.message;
    }
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
};
exports.default = errorHandler;
