import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/db";

interface UserAttributes {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number: string;
  isPremium: boolean;
  forgotPasswordCode: string;
  isVerified: boolean;
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public first_name!: string;
  public last_name!: string;
  public email!: string;
  public password!: string;
  public phone_number!: string;
  public isPremium!: boolean;
  public isVerified!: boolean;
  public forgotPasswordCode!: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    forgotPasswordCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isPremium: { type: DataTypes.BOOLEAN, defaultValue: false },
    isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
  }
);

export { User };
