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
const MessageService_1 = __importDefault(require("../services/MessageService"));
const httpStatuses_1 = __importDefault(require("../utils/httpStatuses"));
class MessageController {
    constructor(io) {
        this.createMessage = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { chatId, messageText, messageType, attachmentUrl, attachmentName, attachmentSize, } = req.body;
                const senderId = parseInt(req.user.id);
                const message = yield MessageService_1.default.createMessage(chatId, senderId, messageText, messageType, attachmentUrl, attachmentName, attachmentSize);
                console.log(message);
                this.io.to(chatId.toString()).emit("newMessage", message);
                console.log(`Message emitted to chat ${chatId}:`, message);
                res.status(httpStatuses_1.default.CREATED.code).json(message);
            }
            catch (error) {
                next(error);
            }
        });
        this.io = io;
    }
    getMessagesByChatId(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chatId = parseInt(req.params.chatId);
                const messages = yield MessageService_1.default.getMessageByChatId(chatId);
                res.status(httpStatuses_1.default.ok.code).json(messages);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = (io) => new MessageController(io);
