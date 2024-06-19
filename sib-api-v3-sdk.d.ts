declare module "sib-api-v3-sdk" {
  namespace SibApiV3Sdk {
    class ApiClient {
      static instance: ApiClientInstance;
    }

    class ApiClientInstance {
      authentications: { "api-key": { apiKey: string } };
    }

    class TransactionalEmailsApi {
      sendTransacEmail(email: SendEmailRequest): Promise<SendEmailResponse>;
    }

    interface SendEmailRequest {
      sender: Sender;
      to: Receiver[];
      subject: string;
      htmlContent: string;
    }

    interface SendEmailResponse {
      messageId: string;
    }

    interface Sender {
      email: string;
      name: string;
    }

    interface Receiver {
      email: string;
    }
  }

  export = SibApiV3Sdk;
}
