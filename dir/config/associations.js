"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/config/associations.ts
const userModel_1 = __importDefault(require("../models/userModel"));
const Chat_1 = __importDefault(require("../models/Chat"));
const ChatMember_1 = __importDefault(require("../models/ChatMember"));
const Messge_1 = __importDefault(require("../models/Messge"));
const Notification_1 = __importDefault(require("../models/Notification"));
// User has many ChatMembers
userModel_1.default.hasMany(ChatMember_1.default, { foreignKey: "userId", as: "chatMembers" });
ChatMember_1.default.belongsTo(userModel_1.default, { foreignKey: "userId", as: "user" });
// Chat has many ChatMembers
Chat_1.default.hasMany(ChatMember_1.default, { foreignKey: "chatId", as: "chatMembers" });
ChatMember_1.default.belongsTo(Chat_1.default, { foreignKey: "chatId", as: "chat" });
// Chat has many Messages
Chat_1.default.hasMany(Messge_1.default, { foreignKey: "chatId", as: "messages" });
Messge_1.default.belongsTo(Chat_1.default, { foreignKey: "chatId", as: "chat" });
// User has many Messages
userModel_1.default.hasMany(Messge_1.default, { foreignKey: "senderId", as: "messages" });
Messge_1.default.belongsTo(userModel_1.default, { foreignKey: "senderId", as: "sender" });
// User has many Notifications
userModel_1.default.hasMany(Notification_1.default, { foreignKey: "userId", as: "notifications" });
Notification_1.default.belongsTo(userModel_1.default, { foreignKey: "userId", as: "user" });
