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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userServices_1 = __importDefault(require("../services/userServices"));
const httpStatuses_1 = __importDefault(require("../utils/httpStatuses"));
const errors_1 = require("../utils/errors");
const emailService_1 = require("../utils/emailService");
class UserController {
    static addUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { first_name, last_name, email, password, phone_number } = req.body;
                const existingUser = yield userServices_1.default.findUserByEmail(email);
                if (existingUser) {
                    throw new errors_1.AppError("User already exists", httpStatuses_1.default.BAD_REQUEST.code);
                }
                const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
                const newUser = yield userServices_1.default.createUser({
                    first_name,
                    last_name,
                    email,
                    password: hashedPassword,
                    phone_number,
                    isVerified: false,
                });
                yield (0, emailService_1.sendVerificationEmail)(newUser.email, newUser.id);
                res
                    .status(httpStatuses_1.default.CREATED.code)
                    .json({ message: "USer created successfully", data: newUser });
            }
            catch (error) {
                next(error);
            }
        });
    }
    static signInUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield userServices_1.default.findUserByEmail(email);
                if (!user) {
                    throw new errors_1.AppError("User not found", httpStatuses_1.default.NOT_FOUND.code);
                }
                const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
                if (!isPasswordValid) {
                    throw new errors_1.AppError("Incorrect password", httpStatuses_1.default.UNAUTHORIZED.code);
                }
                if (!user.isVerified) {
                    throw new errors_1.AppError("Please verify your account", httpStatuses_1.default.UNAUTHORIZED.code);
                }
                const token = jsonwebtoken_1.default.sign({
                    first_name: user.first_name,
                    last_name: user.last_name,
                    id: user.id,
                    phone_number: user.phone_number,
                    isVerified: user.isVerified,
                    email: user.email,
                    image_url: user.image_url,
                }, process.env.TOKEN_SECRET);
                res
                    .status(httpStatuses_1.default.ok.code)
                    .json({ message: "Login successfull", data: token });
            }
            catch (error) {
                next(error);
            }
        });
    }
    static userProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userServices_1.default.findUserByEmail(req.user.email);
                if (!(user === null || user === void 0 ? void 0 : user.isVerified)) {
                    throw new errors_1.AppError("Please verify your account", httpStatuses_1.default.UNAUTHORIZED.code);
                }
                res
                    .status(httpStatuses_1.default.ok.code)
                    .json({ message: "Profile data retrieved successfully", data: user });
            }
            catch (error) {
                next(error);
            }
        });
    }
    static updateUserProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { first_name, last_name, phone_number, image_url } = req.body;
                const userId = req.user.id;
                const updatedUser = yield userServices_1.default.updateUserProfile(userId, {
                    first_name,
                    last_name,
                    phone_number,
                    image_url,
                });
                res.status(httpStatuses_1.default.ok.code).json({
                    message: "Profile updated successfully",
                    data: updatedUser,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    static verifyUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userExist = yield userServices_1.default.findUserById(Number(req.params.id));
                if (!userExist) {
                    throw new errors_1.AppError("User doesn't exist", httpStatuses_1.default.NOT_FOUND.code);
                }
                yield userServices_1.default.verifyUser(userExist.id);
                res
                    .status(httpStatuses_1.default.ok.code)
                    .json({ message: "User verification successfully" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    static forgotPasswordEmail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const userExist = yield userServices_1.default.findUserByEmail(email);
                if (!userExist) {
                    throw new errors_1.AppError("User doesn't exist", httpStatuses_1.default.NOT_FOUND.code);
                }
                const forgotPasswordCode = userServices_1.default.generateSixDigitCode();
                yield userServices_1.default.updateForgotPasswordCode(userExist.id, forgotPasswordCode);
                yield (0, emailService_1.sendForgotPasswordEmail)(email, forgotPasswordCode);
                res
                    .status(httpStatuses_1.default.ok.code)
                    .json({ message: "Update password request sent" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    static verifyForgotPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { forgotPasswordCode, password } = req.body;
                const { email } = req.params;
                if (!forgotPasswordCode || !email || !password) {
                    throw new errors_1.AppError("Provide all required information", httpStatuses_1.default.BAD_REQUEST.code);
                }
                const userExist = yield userServices_1.default.findUserByEmail(email);
                if (!userExist) {
                    throw new errors_1.AppError("User doesn't exist", httpStatuses_1.default.NOT_FOUND.code);
                }
                if (forgotPasswordCode !== userExist.forgot_password_code) {
                    throw new errors_1.AppError("Cann't verify wrong code", httpStatuses_1.default.BAD_REQUEST.code);
                }
                const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
                yield userServices_1.default.updatePassword(userExist.id, hashedPassword);
                res
                    .status(httpStatuses_1.default.ok.code)
                    .json({ message: "Update password request sent" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    static changePassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { password } = req.body;
                const userExist = yield userServices_1.default.findUserById(req.user.id);
                if (!userExist) {
                    throw new errors_1.AppError("User doesn't exist", httpStatuses_1.default.NOT_FOUND.code);
                }
                const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
                yield userServices_1.default.updatePassword(userExist.id, hashedPassword);
                res
                    .status(httpStatuses_1.default.ok.code)
                    .json({ message: "Password changed successfully" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    static searchUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userEmail } = req.query;
                if (!userEmail || typeof userEmail !== "string") {
                    throw new errors_1.AppError("No such user found!", httpStatuses_1.default.NOT_FOUND.code);
                }
                const userId = parseInt(req.user.id);
                const userEmails = yield userServices_1.default.findAllUser(userId, userEmail);
                // console.log(userEmails);
                res.status(httpStatuses_1.default.ok.code).json({
                    message: "all users data fetched Successfully",
                    data: userEmails,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    static allUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allUsers = yield userServices_1.default.findAllUsers();
                // console.log(userEmails);
                res.status(httpStatuses_1.default.ok.code).json({
                    message: "all users data fetched Successfully",
                    data: allUsers,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = UserController;
