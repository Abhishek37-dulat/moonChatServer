import { Request, Response, NextFunction } from "express";
import HTTP_STATUSES from "../utils/httpStatuses";
import { AppError } from "../utils/errors";
import UserService from "../services/userServices";
import { uploadToS3 } from "../config/multer";

class ImageController {
  public static async uploadUserImage(
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.file) {
        throw new AppError("No file uploaded", HTTP_STATUSES.BAD_REQUEST.code);
      }

      const userId = req.user.id;
      const bucketName: string | undefined = process.env.S3_BUCKET_NAME;
      const key = `user-profiles/${userId}/${req.file.originalname}`;

      const uploadResult = await uploadToS3(req.file, bucketName!, key);
      const imageUrl = uploadResult.Location;
      const updatedUser = await UserService.updateUserImage(
        Number(userId),
        imageUrl!
      );

      res
        .status(HTTP_STATUSES.CREATED.code)
        .json({ imageUrl, user: updatedUser });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteUserImage(
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user.id;
      await UserService.deleteUserImage(Number(userId));
      res
        .status(HTTP_STATUSES.ok.code)
        .json({ message: "Image deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

export default ImageController;
