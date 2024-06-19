"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("../config/multer"));
const imageController_1 = __importDefault(require("../controllers/imageController"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = (0, express_1.Router)();
router.post("/upload", authMiddleware_1.default.auth, multer_1.default.single("image"), imageController_1.default.uploadUserImage);
router.delete("/delete", authMiddleware_1.default.auth, imageController_1.default.deleteUserImage);
exports.default = router;
