import { Router } from "express";
import UserController from "../controllers/userController";
import AuthMiddleware from "../middleware/authMiddleware";

const router = Router();

router.post("/register", UserController.addUser);
router.post("/login", UserController.signInUser);
router.get("/profile", AuthMiddleware.auth, UserController.userProfile);
router.patch("/profile", AuthMiddleware.auth, UserController.updateUserProfile);
router.patch("/verify/:id", UserController.verifyUser);
router.post("/forgot-password", UserController.forgotPasswordEmail);
router.patch("/reset-password/:email", UserController.verifyForgotPassword);
router.patch(
  "/change-password",
  AuthMiddleware.auth,
  UserController.changePassword
);
router.get("/search", AuthMiddleware.auth, UserController.searchUser);
router.get("/alluser", AuthMiddleware.auth, UserController.allUser);

export default router;
