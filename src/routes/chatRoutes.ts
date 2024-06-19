import { Router } from "express";
// import ChatController from "../controllers/chatController";
import AuthMiddleware from "../middleware/authMiddleware";
import chatController from "../controllers/chatController";

const router = Router();

router.post("/chats", AuthMiddleware.auth, chatController.createChat);
router.get("/chats/:chatId", AuthMiddleware.auth, chatController.getChatById);
router.get(
  "/users/:userId/chats",
  AuthMiddleware.auth,
  chatController.getUserChats
);

export default router;
