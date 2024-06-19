import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface UserAttributes {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  image_url?: string;
  password: string;
  isVerified: boolean;
  forgot_password_code?: string;
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public first_name!: string;
  public last_name!: string;
  public email!: string;
  public phone_number?: string | undefined;
  public image_url?: string | undefined;
  public password!: string;
  public isVerified!: boolean;
  public forgot_password_code?: string | undefined;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
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
    },
    image_url: {
      type: DataTypes.STRING,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    forgot_password_code: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "Users",
    indexes: [
      {
        fields: ["email", "first_name", "phone_number"],
        unique: false,
      },
    ],
  }
);

export default User;
