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
const Chat_1 = __importDefault(require("../models/Chat"));
const ChatMember_1 = __importDefault(require("../models/ChatMember"));
const errors_1 = require("../utils/errors");
class ChatService {
    createChat(chatName, isGroup, userIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isGroup && userIds.length !== 2) {
                throw new errors_1.ValidationError("One-to-one chats must have exactly 2 users.");
            }
            const chat = yield Chat_1.default.create({ chatName, isGroup });
            for (const userId of userIds) {
                yield ChatMember_1.default.create({ chatId: chat.id, userId, isAdmin: false });
            }
            return chat;
        });
    }
    getChatById(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            const chat = yield Chat_1.default.findByPk(chatId, {
                include: [{ model: ChatMember_1.default, as: "chatMembers" }],
            });
            if (!chat) {
                throw new errors_1.NotFoundError("Chat not found");
            }
            return chat;
        });
    }
    getUserChats(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const chatMembers = yield ChatMember_1.default.findAll({ where: { userId } });
            const chatIds = chatMembers.map((cm) => cm.chatId);
            return Chat_1.default.findAll({ where: { id: chatIds } });
        });
    }
}
exports.default = new ChatService();
