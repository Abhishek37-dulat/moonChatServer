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
const Messge_1 = __importDefault(require("../models/Messge"));
const errors_1 = require("../utils/errors");
class MessageService {
    createMessage(chatId, senderId, messageText, messageType, attachmentUrl, attachmentName, attachmentSize) {
        return __awaiter(this, void 0, void 0, function* () {
            const validMessageTypes = ["text", "image", "file", "voice"];
            if (!validMessageTypes.includes(messageType)) {
                throw new errors_1.ValidationError("Invalid message type");
            }
            const message = yield Messge_1.default.create({
                chatId,
                senderId,
                messageText,
                messageType,
                attachmentUrl,
                attachmentName,
                attachmentSize,
                sentAt: new Date(),
            });
            return message;
        });
    }
    getMessageByChatId(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            return Messge_1.default.findAll({ where: { chatId } });
        });
    }
}
exports.default = new MessageService();
