// src/models/ChatMember.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import User from "./userModel";
import Chat from "./Chat";

interface ChatMemberAttributes {
  chatId: number;
  userId: number;
  isAdmin: boolean;
}

class ChatMember
  extends Model<ChatMemberAttributes>
  implements ChatMemberAttributes
{
  public chatId!: number;
  public userId!: number;
  public isAdmin!: boolean;
}

ChatMember.init(
  {
    chatId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Chat,
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "ChatMember",
    tableName: "ChatMembers",
  }
);

export default ChatMember;
