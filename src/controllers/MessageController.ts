import { Request, Response, NextFunction } from "express";
import MessageService from "../services/MessageService";
import HTTP_STATUSES from "../utils/httpStatuses";
import { Server as SocketIoServer } from "socket.io";

class MessageController {
  private io: SocketIoServer;

  constructor(io: SocketIoServer) {
    this.io = io;
  }

  public createMessage = async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const {
        chatId,
        messageText,
        messageType,
        attachmentUrl,
        attachmentName,
        attachmentSize,
      } = req.body;
      const senderId = parseInt(req.user.id);
      const message = await MessageService.createMessage(
        chatId,
        senderId,
        messageText,
        messageType,
        attachmentUrl,
        attachmentName,
        attachmentSize
      );
      console.log(message);
      this.io.to(chatId.toString()).emit("newMessage", message);
      console.log(`Message emitted to chat ${chatId}:`, message);

      res.status(HTTP_STATUSES.CREATED.code).json(message);
    } catch (error) {
      next(error);
    }
  };

  async getMessagesByChatId(req: Request, res: Response, next: NextFunction) {
    try {
      const chatId = parseInt(req.params.chatId);
      const messages = await MessageService.getMessageByChatId(chatId);
      res.status(HTTP_STATUSES.ok.code).json(messages);
    } catch (error) {
      next(error);
    }
  }
}

export default (io: SocketIoServer) => new MessageController(io);
