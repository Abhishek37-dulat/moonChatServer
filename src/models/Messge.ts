import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import User from "./userModel";
import Chat from "./Chat";

interface MessageAttributes {
  id: number;
  chatId: number;
  senderId: number;
  messageText?: string;
  messageType: "text" | "image" | "file" | "voice";
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentSize?: number;
  sentAt: Date;
}

class Message extends Model<MessageAttributes> implements MessageAttributes {
  public id!: number;
  public chatId!: number;
  public senderId!: number;
  public messageText?: string | undefined;
  public messageType!: "text" | "image" | "file" | "voice";
  public attachmentUrl?: string | undefined;
  public attachmentName?: string | undefined;
  public attachmentSize?: number | undefined;
  public sentAt!: Date;
}

Message.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    chatId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Chat,
        key: "id",
      },
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    messageText: {
      type: DataTypes.TEXT,
    },
    messageType: {
      type: DataTypes.ENUM("text", "image", "file", "voice"),
      allowNull: false,
      defaultValue: "text",
    },
    attachmentUrl: {
      type: DataTypes.STRING,
    },
    attachmentName: {
      type: DataTypes.STRING,
    },
    attachmentSize: {
      type: DataTypes.INTEGER,
    },
    sentAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Message",
    tableName: "Messages",
  }
);

export default Message;
