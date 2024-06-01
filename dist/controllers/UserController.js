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
const User_1 = require("../models/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Sib = require("sib-api-v3-sdk");
class UserController {
    static addUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { first_name, last_name, email, password, phone_number, } = req.body;
                const existingUser = yield User_1.User.findOne({
                    where: { email },
                });
                if (existingUser) {
                    res.status(400).json({ message: "User already exists" });
                    return;
                }
                const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
                const newUser = yield User_1.User.create({
                    first_name,
                    last_name,
                    email,
                    phone_number,
                    password: hashedPassword,
                    isPremium: false,
                    isVerified: false,
                });
                const client = yield Sib.ApiClient.instance;
                const apiKey = yield client.authentications["api-key"];
                apiKey.apiKey = process.env.SENDBLUE;
                const tranEmailApi = new Sib.TransactionalEmailsApi();
                const sender = {
                    email: "sendmailm6@gmail.com",
                    name: "Abhishek",
                };
                const receivers = [{ email: email }];
                tranEmailApi.sendTransacEmail({
                    sender,
                    to: receivers,
                    subject: "Verify Userself",
                    htmlContent: `<p>Verify yourself: <a href="http://localhost:3000/user/verify/${newUser.id}">Verify yourself</a></p>`,
                });
                // console.log(tranEmailApi);
                res
                    .status(201)
                    .json({ message: "User created successfully", data: newUser });
            }
            catch (error) {
                console.error("Error while adding user:", error);
                res.status(500).json({ message: "Server error" });
            }
        });
    }
}
exports.default = UserController;
