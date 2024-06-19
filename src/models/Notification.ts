import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import User from "./userModel";

interface NotificationAttributes {
  id: number;
  userId: number;
  message: string;
  read: boolean;
}

class Notification
  extends Model<NotificationAttributes>
  implements NotificationAttributes
{
  public id!: number;
  public userId!: number;
  public message!: string;
  public read!: boolean;
}

Notification.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Notification",
    tableName: "Notifications",
  }
);

export default Notification;
