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
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const socketMiddleware_1 = __importDefault(require("./middleware/socketMiddleware"));
// Load environment variables
dotenv_1.default.config();
console.log("Environment variables loaded");
console.warn("Warning: Ensure sensitive info is properly handled");
const PORT = process.env.PORT || 8001;
const appInstance = new app_1.default();
const server = (0, http_1.createServer)(appInstance.app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
    },
});
const socketHandler = new socketMiddleware_1.default(io);
socketHandler.handleMessageEvents();
appInstance.addSocketRoutes(io);
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            server.listen(PORT, () => {
                console.info("Server started on port: ", PORT);
            });
        }
        catch (err) {
            console.error("Failed to start server: ", err);
        }
    });
}
startServer();
