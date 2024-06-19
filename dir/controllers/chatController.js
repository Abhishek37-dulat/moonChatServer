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
const chatService_1 = __importDefault(require("../services/chatService"));
const errors_1 = require("../utils/errors");
const httpStatuses_1 = __importDefault(require("../utils/httpStatuses"));
class ChatController {
    createChat(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { chatName, isGroup, userIds } = req.body;
                const userNotInArr = userIds.filter((data) => data === req.user.id);
                userIds.push(req.user.id);
                if (userNotInArr.length > 0) {
                    throw new errors_1.NotFoundError("Duplicate USer Chat Error");
                }
                const chat = yield chatService_1.default.createChat(chatName, isGroup, userIds);
                res.status(httpStatuses_1.default.CREATED.code).json(chat);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getChatById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chatId = parseInt(req.params.chatId);
                const chat = yield chatService_1.default.getChatById(chatId);
                res.status(httpStatuses_1.default.ok.code).json(chat);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getUserChats(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (parseInt(req.params.userId) !== parseInt(req.user.id)) {
                    throw new errors_1.NotFoundError("you can read this chat");
                }
                const userId = parseInt(req.params.userId);
                const chats = yield chatService_1.default.getUserChats(userId);
                res.status(httpStatuses_1.default.ok.code).json(chats);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new ChatController();
