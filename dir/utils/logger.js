"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class Logger {
    static init() {
        if (!fs_1.default.existsSync(Logger.logDir)) {
            fs_1.default.mkdirSync(Logger.logDir);
        }
    }
    static log(message) {
        const logMessage = `${new Date().toISOString()} - ${message}\n`;
        fs_1.default.appendFileSync(Logger.logFile, logMessage);
        console.log(logMessage);
    }
    static error(message) {
        const errorMessage = `${new Date().toISOString()} - ${message}\n`;
        fs_1.default.appendFileSync(Logger.logFile, errorMessage);
        console.log(errorMessage);
    }
}
Logger.logDir = path_1.default.join(__dirname, "../../logs");
Logger.logFile = path_1.default.join(Logger.logDir, "app.log");
Logger.init();
exports.default = Logger;
