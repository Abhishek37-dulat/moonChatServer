"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const MessageController_1 = __importDefault(require("../controllers/MessageController"));
const router = express_1.default.Router();
exports.default = (io) => {
    const MessageController = (0, MessageController_1.default)(io);
    router.post("/messages", authMiddleware_1.default.auth, MessageController.createMessage);
    router.get("/chats/:chatId/messages", authMiddleware_1.default.auth, MessageController.getMessagesByChatId);
    return router;
};
