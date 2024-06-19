import Message from "../models/Messge";
import { NotFoundError, ValidationError } from "../utils/errors";

class MessageService {
  async createMessage(
    chatId: number,
    senderId: number,
    messageText: string,
    messageType: string,
    attachmentUrl?: string,
    attachmentName?: string,
    attachmentSize?: number
  ): Promise<Message> {
    const validMessageTypes = ["text", "image", "file", "voice"];
    if (!validMessageTypes.includes(messageType)) {
      throw new ValidationError("Invalid message type");
    }

    const message = await Message.create({
      chatId,
      senderId,
      messageText,
      messageType,
      attachmentUrl,
      attachmentName,
      attachmentSize,
      sentAt: new Date(),
    } as Message);
    return message;
  }
  async getMessageByChatId(chatId: number): Promise<Message[]> {
    return Message.findAll({ where: { chatId } });
  }
}

export default new MessageService();
