const Sib: any = require("sib-api-v3-sdk");

// const client = Sib.ApiClient.instance;
// const apikey = client.authentications["api-key"];
// apikey.apikey = process.env.SENDBLUE;

// const tranEmailApi = new Sib.TransactionalEmailApi();

// const sender = {
//   email: "sendmailm6@gmail.com",
//   name: "Moon Chat",
// };

export const sendVerificationEmail = async (email: string, userId: number) => {
  const client: any = await Sib.ApiClient.instance;
  const apiKey: any = await client.authentications["api-key"];
  apiKey.apiKey = process.env.SENDBLUE;
  const tranEmailApi = new Sib.TransactionalEmailsApi();
  const sender = {
    email: "sendmailm6@gmail.com",
    name: "Moon Chat",
  };
  const receivers = [{ email }];
  await tranEmailApi.sendTransacEmail({
    sender,
    to: receivers,
    subject: "Verify Yourself",
    htmlContent: `<p>Verify Youself: <a href='${process.env.FRONTEND_URL}/${userId}'>Verify yourself</a></p>`,
  });
};

export const sendForgotPasswordEmail = async (email: string, code: string) => {
  const client: any = await Sib.ApiClient.instance;
  const apiKey: any = await client.authentications["api-key"];
  apiKey.apiKey = process.env.SENDBLUE;
  const tranEmailApi = new Sib.TransactionalEmailsApi();
  const sender = {
    email: "sendmailm6@gmail.com",
    name: "Moon Chat",
  };
  const receivers = [{ email }];
  await tranEmailApi.sendTransacEmail({
    sender,
    to: receivers,
    subject: "Update Password Code",
    htmlContent: `<p>Moon Chat</p><p>One Time Password: <b>${code}</b></p>`,
  });
};
