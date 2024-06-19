"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class User extends sequelize_1.Model {
}
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    first_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    phone_number: {
        type: sequelize_1.DataTypes.STRING,
    },
    image_url: {
        type: sequelize_1.DataTypes.STRING,
    },
    isVerified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    forgot_password_code: {
        type: sequelize_1.DataTypes.STRING,
    },
}, {
    sequelize: database_1.default,
    modelName: "User",
    tableName: "Users",
    indexes: [
        {
            fields: ["email", "first_name", "phone_number"],
            unique: false,
        },
    ],
});
exports.default = User;
