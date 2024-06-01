"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController_1 = __importDefault(require("../controllers/UserController"));
const route = express_1.default.Router();
route.post("/signup", UserController_1.default.addUser);
// route.post("/login", UserController.SignInUser);
// route.get("/profile", AuthMiddleWare.auth, UserController.UserProfile);
// route.patch("/verify/:id", UserController.verifyUser);
// route.post("/forgot", UserController.forgotPasswordEmail);
// route.patch("/forgot/:email", UserController.verifyForgotPassword);
// route.patch("/change", AuthMiddleWare.auth, UserController.changePassword);
exports.default = route;
