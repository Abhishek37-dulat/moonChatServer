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
const httpStatuses_1 = __importDefault(require("../utils/httpStatuses"));
const errors_1 = require("../utils/errors");
const userServices_1 = __importDefault(require("../services/userServices"));
const multer_1 = require("../config/multer");
class ImageController {
    static uploadUserImage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.file) {
                    throw new errors_1.AppError("No file uploaded", httpStatuses_1.default.BAD_REQUEST.code);
                }
                const userId = req.user.id;
                const bucketName = process.env.S3_BUCKET_NAME;
                const key = `user-profiles/${userId}/${req.file.originalname}`;
                const uploadResult = yield (0, multer_1.uploadToS3)(req.file, bucketName, key);
                const imageUrl = uploadResult.Location;
                const updatedUser = yield userServices_1.default.updateUserImage(Number(userId), imageUrl);
                res
                    .status(httpStatuses_1.default.CREATED.code)
                    .json({ imageUrl, user: updatedUser });
            }
            catch (error) {
                next(error);
            }
        });
    }
    static deleteUserImage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                yield userServices_1.default.deleteUserImage(Number(userId));
                res
                    .status(httpStatuses_1.default.ok.code)
                    .json({ message: "Image deleted successfully" });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = ImageController;
