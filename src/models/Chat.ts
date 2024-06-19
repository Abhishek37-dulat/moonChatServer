import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

interface ChatAttributes {
  id: number;
  chatName?: string;
  isGroup: boolean;
}

class Chat extends Model<ChatAttributes> implements ChatAttributes {
  public id!: number;
  public chatName?: string | undefined;
  public isGroup!: boolean;
}

Chat.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    chatName: {
      type: DataTypes.STRING,
    },
    isGroup: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Chat",
    tableName: "Chats",
  }
);

export default Chat;
