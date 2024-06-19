import { Request, Response, NextFunction } from "express";
import ChatService from "../services/chatService";
import { AppError, NotFoundError } from "../utils/errors";
import HTTP_STATUSES from "../utils/httpStatuses";

class ChatController {
  async createChat(
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) {
    try {
      const { chatName, isGroup, userIds } = req.body;

      const userNotInArr = userIds.filter(
        (data: number) => data === req.user.id
      );
      userIds.push(req.user.id);
      if (userNotInArr.length > 0) {
        throw new NotFoundError("Duplicate USer Chat Error");
      }
      const chat = await ChatService.createChat(chatName, isGroup, userIds);
      res.status(HTTP_STATUSES.CREATED.code).json(chat);
    } catch (error) {
      next(error);
    }
  }
  async getChatById(req: Request, res: Response, next: NextFunction) {
    try {
      const chatId = parseInt(req.params.chatId);
      const chat = await ChatService.getChatById(chatId);
      res.status(HTTP_STATUSES.ok.code).json(chat);
    } catch (error) {
      next(error);
    }
  }
  async getUserChats(
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) {
    try {
      if (parseInt(req.params.userId) !== parseInt(req.user.id)) {
        throw new NotFoundError("you can read this chat");
      }
      const userId = parseInt(req.params.userId);
      const chats = await ChatService.getUserChats(userId);
      res.status(HTTP_STATUSES.ok.code).json(chats);
    } catch (error) {
      next(error);
    }
  }
}

export default new ChatController();
