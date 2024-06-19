import { Router } from "express";
import upload from "../config/multer";
import ImageController from "../controllers/imageController";
import AuthMiddleware from "../middleware/authMiddleware";

const router = Router();

router.post(
  "/upload",
  AuthMiddleware.auth,
  upload.single("image"),
  ImageController.uploadUserImage
);
router.delete("/delete", AuthMiddleware.auth, ImageController.deleteUserImage);

export default router;
