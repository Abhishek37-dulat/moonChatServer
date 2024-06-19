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
const database_1 = __importDefault(require("../config/database"));
const userModel_1 = __importDefault(require("../models/userModel"));
const errors_1 = require("../utils/errors");
const imageService_1 = __importDefault(require("./imageService"));
const sequelize_1 = require("sequelize");
class UserService {
    static findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield userModel_1.default.findOne({
                    where: { email },
                });
            }
            catch (error) {
                this.handleError(error, "Failed to find user by email");
            }
        });
    }
    static findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield userModel_1.default.findByPk(id);
            }
            catch (error) {
                this.handleError(error, "Failed to find user by ID");
            }
        });
    }
    static updateUserProfile(id, updatedData) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.findUserById(id);
            if (!user) {
                throw new errors_1.NotFoundError(`User with ID ${id} not found`);
            }
            try {
                yield userModel_1.default.update(updatedData, { where: { id } });
                return (yield this.findUserById(id));
            }
            catch (error) {
                this.handleError(error, "Failed to update user profile");
            }
        });
    }
    static createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield userModel_1.default.create(userData);
            }
            catch (error) {
                this.handleError(error, "Failed to create user");
            }
        });
    }
    static verifyUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.findUserById(id);
            if (!user) {
                throw new errors_1.NotFoundError(`User with ID ${id} not found`);
            }
            try {
                yield userModel_1.default.update({ isVerified: true }, { where: { id } });
            }
            catch (error) {
                this.handleError(error, "Failed to verify user");
            }
        });
    }
    static generateSixDigitCode() {
        const min = 100000;
        const max = 999999;
        return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
    }
    static updateForgotPasswordCode(id, code) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.findUserById(id);
            if (!user) {
                throw new errors_1.NotFoundError(`User with ID ${id} not found`);
            }
            try {
                yield user.update({ forgot_password_code: code }, { where: { id } });
            }
            catch (error) {
                this.handleError(error, "Failed to update forgot password code");
            }
        });
    }
    static updatePassword(id, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.findUserById(id);
            if (!user) {
                throw new errors_1.NotFoundError(`User with ID ${id} not found`);
            }
            try {
                const userDetails = yield user.update({
                    password: newPassword,
                });
                console.log(userDetails);
            }
            catch (error) {
                this.handleError(error, "Failed to update password");
            }
        });
    }
    static updateUserImage(userId, imageUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userModel_1.default.findByPk(userId);
                if (!user) {
                    throw new errors_1.NotFoundError(`User with ID ${userId} not found`);
                }
                user.image_url = imageUrl;
                yield user.save();
                return user;
            }
            catch (error) {
                throw new errors_1.DatabaseError("Failed to update user image in the database");
            }
        });
    }
    static deleteUserImage(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const t = yield database_1.default.transaction();
            try {
                const user = yield userModel_1.default.findByPk(userId, { transaction: t });
                if (!user) {
                    throw new errors_1.NotFoundError(`User with ID ${userId} not found`);
                }
                if (user.image_url) {
                    const ImageServiceRes = yield imageService_1.default.deleteImage(user.image_url, userId);
                    if (ImageServiceRes >= 200 || ImageServiceRes <= 300) {
                        yield user.update({
                            image_url: undefined,
                        }, { transaction: t });
                        t.commit();
                    }
                    else {
                        throw new errors_1.DatabaseError("Failed to delete user image from the database");
                    }
                }
            }
            catch (error) {
                throw new errors_1.DatabaseError("Failed to delete user image from the database");
            }
        });
    }
    static findAllUser(userId, userSearchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log(userSearchQuery);
                const AllUsers = yield userModel_1.default.findAll({
                    attributes: { exclude: ["password"] },
                    where: {
                        email: {
                            [sequelize_1.Op.like]: `%${userSearchQuery}%`,
                        },
                    },
                });
                // console.log(AllUsers);
                return AllUsers;
            }
            catch (error) {
                this.handleError(error, "Failed to fetch data from User Database");
            }
        });
    }
    static findAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const AllUsers = yield userModel_1.default.findAll({
                    attributes: { exclude: ["password"] },
                });
                return AllUsers;
            }
            catch (error) {
                this.handleError(error, "Failed to fetch data from User Database");
            }
        });
    }
    static handleError(error, message) {
        if (error instanceof Error) {
            throw new errors_1.DatabaseError(`${message}: ${error.message}`);
        }
        else {
            throw new errors_1.DatabaseError(message);
        }
    }
}
exports.default = UserService;
