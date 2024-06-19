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
const client_s3_1 = require("@aws-sdk/client-s3");
const aws_1 = __importDefault(require("../config/aws"));
// const s3Client = new S3Client({
//   region: process.env.S3_BUCKET_REGION,
// });
class ImageService {
    static deleteImage(imageUrl, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const key = `user-profiles/${userId}/${imageUrl.split("/").pop()}`;
                const params = {
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: key,
                };
                const command = new client_s3_1.DeleteObjectCommand(params);
                const response = yield aws_1.default.send(command);
                return response.$metadata.httpStatusCode;
            }
            catch (error) {
                console.error("Error deleting object from S3:", error);
                throw error;
            }
        });
    }
}
exports.default = ImageService;
