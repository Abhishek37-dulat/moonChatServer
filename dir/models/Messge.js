"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const userModel_1 = __importDefault(require("./userModel"));
const Chat_1 = __importDefault(require("./Chat"));
class Message extends sequelize_1.Model {
}
Message.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    chatId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Chat_1.default,
            key: "id",
        },
    },
    senderId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: userModel_1.default,
            key: "id",
        },
    },
    messageText: {
        type: sequelize_1.DataTypes.TEXT,
    },
    messageType: {
        type: sequelize_1.DataTypes.ENUM("text", "image", "file", "voice"),
        allowNull: false,
        defaultValue: "text",
    },
    attachmentUrl: {
        type: sequelize_1.DataTypes.STRING,
    },
    attachmentName: {
        type: sequelize_1.DataTypes.STRING,
    },
    attachmentSize: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    sentAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: database_1.default,
    modelName: "Message",
    tableName: "Messages",
});
exports.default = Message;
