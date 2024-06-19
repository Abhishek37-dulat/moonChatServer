"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const imageRoutes_1 = __importDefault(require("./routes/imageRoutes"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const messageRoutes_1 = __importDefault(require("./routes/messageRoutes"));
const database_1 = __importDefault(require("./config/database"));
const logger_1 = __importDefault(require("./utils/logger"));
const errorMiddleware_1 = __importDefault(require("./middleware/errorMiddleware"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
require("./config/associations");
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.config();
        this.routes();
        this.databaseConnect();
        this.handleErrors();
        this.loadEnv();
    }
    config() {
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use(express_1.default.json());
        this.app.use((0, helmet_1.default)());
        this.app.use((0, compression_1.default)());
        this.app.use((0, morgan_1.default)("combined", { stream: this.accessLogStream }));
    }
    routes() {
        this.app.use("/api/users", userRoutes_1.default);
        this.app.use("/api/images", imageRoutes_1.default);
        this.app.use("/api", chatRoutes_1.default);
    }
    addSocketRoutes(io) {
        this.app.use("/api", (0, messageRoutes_1.default)(io));
    }
    handleErrors() {
        this.app.use(errorMiddleware_1.default);
    }
    loadEnv() {
        dotenv_1.default.config();
        console.log("Environment variables loaded");
        console.warn("Warning: Ensure sensitive info is properly handled");
    }
    databaseConnect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield database_1.default.authenticate();
                logger_1.default.log("Database connected successfully.");
                yield database_1.default.sync();
            }
            catch (error) {
                logger_1.default.error(`Database connection failed: ${error}`);
                process.exit(1);
            }
        });
    }
}
exports.default = App;
