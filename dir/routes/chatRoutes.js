"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import ChatController from "../controllers/chatController";
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const chatController_1 = __importDefault(require("../controllers/chatController"));
const router = (0, express_1.Router)();
router.post("/chats", authMiddleware_1.default.auth, chatController_1.default.createChat);
router.get("/chats/:chatId", authMiddleware_1.default.auth, chatController_1.default.getChatById);
router.get("/users/:userId/chats", authMiddleware_1.default.auth, chatController_1.default.getUserChats);
exports.default = router;
