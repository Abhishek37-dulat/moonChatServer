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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendForgotPasswordEmail = exports.sendVerificationEmail = void 0;
const Sib = require("sib-api-v3-sdk");
// const client = Sib.ApiClient.instance;
// const apikey = client.authentications["api-key"];
// apikey.apikey = process.env.SENDBLUE;
// const tranEmailApi = new Sib.TransactionalEmailApi();
// const sender = {
//   email: "sendmailm6@gmail.com",
//   name: "Moon Chat",
// };
const sendVerificationEmail = (email, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield Sib.ApiClient.instance;
    const apiKey = yield client.authentications["api-key"];
    apiKey.apiKey = process.env.SENDBLUE;
    const tranEmailApi = new Sib.TransactionalEmailsApi();
    const sender = {
        email: "sendmailm6@gmail.com",
        name: "Moon Chat",
    };
    const receivers = [{ email }];
    yield tranEmailApi.sendTransacEmail({
        sender,
        to: receivers,
        subject: "Verify Yourself",
        htmlContent: `<p>Verify Youself: <a href='${process.env.FRONTEND_URL}/${userId}'>Verify yourself</a></p>`,
    });
});
exports.sendVerificationEmail = sendVerificationEmail;
const sendForgotPasswordEmail = (email, code) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield Sib.ApiClient.instance;
    const apiKey = yield client.authentications["api-key"];
    apiKey.apiKey = process.env.SENDBLUE;
    const tranEmailApi = new Sib.TransactionalEmailsApi();
    const sender = {
        email: "sendmailm6@gmail.com",
        name: "Moon Chat",
    };
    const receivers = [{ email }];
    yield tranEmailApi.sendTransacEmail({
        sender,
        to: receivers,
        subject: "Update Password Code",
        htmlContent: `<p>Moon Chat</p><p>One Time Password: <b>${code}</b></p>`,
    });
});
exports.sendForgotPasswordEmail = sendForgotPasswordEmail;
