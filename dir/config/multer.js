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
exports.uploadToS3 = void 0;
const multer_1 = __importDefault(require("multer"));
const lib_storage_1 = require("@aws-sdk/lib-storage");
const aws_1 = __importDefault(require("./aws"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
const uploadToS3 = (file, bucketName, key) => __awaiter(void 0, void 0, void 0, function* () {
    const upload = new lib_storage_1.Upload({
        client: aws_1.default,
        params: {
            Bucket: bucketName,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        },
    });
    const result = yield upload.done();
    return result;
});
exports.uploadToS3 = uploadToS3;
exports.default = upload;
