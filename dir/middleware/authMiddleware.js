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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class AuthMiddleWare {
    static auth(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.header("Authorization");
                if (!token)
                    throw new Error("Token not provided");
                const verifiedToken = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
                if (!verifiedToken ||
                    typeof verifiedToken === "string" ||
                    typeof verifiedToken !== "object") {
                    throw new Error("Invalid token");
                }
                const user = verifiedToken;
                const userData = yield userModel_1.default.findByPk(user.id);
                if (!userData)
                    throw new Error("User not found");
                req.user = userData;
                next();
            }
            catch (error) {
                console.error("Error in authorization:", error);
                res
                    .status(500)
                    .json({ message: "User not authorized", error: error.message });
            }
        });
    }
}
exports.default = AuthMiddleWare;
