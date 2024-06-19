import Chat from "../models/Chat";
import ChatMember from "../models/ChatMember";
import { NotFoundError, ValidationError } from "../utils/errors";

class ChatService {
  async createChat(
    chatName: string | undefined,
    isGroup: boolean,
    userIds: number[]
  ): Promise<Chat> {
    if (!isGroup && userIds.length !== 2) {
      throw new ValidationError("One-to-one chats must have exactly 2 users.");
    }
    const chat = await Chat.create({ chatName, isGroup } as Chat);
    for (const userId of userIds) {
      await ChatMember.create({ chatId: chat.id, userId, isAdmin: false });
    }
    return chat;
  }
  async getChatById(chatId: number): Promise<Chat> {
    const chat = await Chat.findByPk(chatId, {
      include: [{ model: ChatMember, as: "chatMembers" }],
    });
    if (!chat) {
      throw new NotFoundError("Chat not found");
    }
    return chat;
  }

  async getUserChats(userId: number): Promise<Chat[]> {
    const chatMembers = await ChatMember.findAll({ where: { userId } });
    const chatIds = chatMembers.map((cm) => cm.chatId);
    return Chat.findAll({ where: { id: chatIds } });
  }
}

export default new ChatService();
