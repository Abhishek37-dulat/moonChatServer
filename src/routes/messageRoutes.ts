import express from "express";
import AuthMiddleware from "../middleware/authMiddleware";
import createMessageController from "../controllers/MessageController";
import { Server as SocketIoServer } from "socket.io";

const router = express.Router();

export default (io: SocketIoServer) => {
  const MessageController = createMessageController(io);
  router.post(
    "/messages",
    AuthMiddleware.auth,
    MessageController.createMessage
  );
  router.get(
    "/chats/:chatId/messages",
    AuthMiddleware.auth,
    MessageController.getMessagesByChatId
  );

  return router;
};
