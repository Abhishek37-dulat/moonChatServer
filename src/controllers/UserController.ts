import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserService from "../services/userServices";
import HTTP_STATUSES from "../utils/httpStatuses";
import { AppError } from "../utils/errors";
import {
  sendVerificationEmail,
  sendForgotPasswordEmail,
} from "../utils/emailService";

class UserController {
  static async addUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { first_name, last_name, email, password, phone_number } = req.body;
      const existingUser = await UserService.findUserByEmail(email);
      if (existingUser) {
        throw new AppError(
          "User already exists",
          HTTP_STATUSES.BAD_REQUEST.code
        );
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await UserService.createUser({
        first_name,
        last_name,
        email,
        password: hashedPassword,
        phone_number,
        isVerified: false,
      });
      await sendVerificationEmail(newUser.email, newUser.id);
      res
        .status(HTTP_STATUSES.CREATED.code)
        .json({ message: "USer created successfully", data: newUser });
    } catch (error) {
      next(error);
    }
  }
  static async signInUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password } = req.body;
      const user = await UserService.findUserByEmail(email);
      if (!user) {
        throw new AppError("User not found", HTTP_STATUSES.NOT_FOUND.code);
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new AppError(
          "Incorrect password",
          HTTP_STATUSES.UNAUTHORIZED.code
        );
      }
      if (!user.isVerified) {
        throw new AppError(
          "Please verify your account",
          HTTP_STATUSES.UNAUTHORIZED.code
        );
      }
      const token = jwt.sign(
        {
          first_name: user.first_name,
          last_name: user.last_name,
          id: user.id,
          phone_number: user.phone_number,
          isVerified: user.isVerified,
          email: user.email,
          image_url: user.image_url,
        },
        process.env.TOKEN_SECRET as string
      );
      res
        .status(HTTP_STATUSES.ok.code)
        .json({ message: "Login successfull", data: token });
    } catch (error) {
      next(error);
    }
  }
  static async userProfile(
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await UserService.findUserByEmail(req.user.email);
      if (!user?.isVerified) {
        throw new AppError(
          "Please verify your account",
          HTTP_STATUSES.UNAUTHORIZED.code
        );
      }
      res
        .status(HTTP_STATUSES.ok.code)
        .json({ message: "Profile data retrieved successfully", data: user });
    } catch (error) {
      next(error);
    }
  }

  static async updateUserProfile(
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { first_name, last_name, phone_number, image_url } = req.body;
      const userId = req.user.id;

      const updatedUser = await UserService.updateUserProfile(userId, {
        first_name,
        last_name,
        phone_number,
        image_url,
      });

      res.status(HTTP_STATUSES.ok.code).json({
        message: "Profile updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }

  static async verifyUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userExist = await UserService.findUserById(Number(req.params.id));
      if (!userExist) {
        throw new AppError("User doesn't exist", HTTP_STATUSES.NOT_FOUND.code);
      }
      await UserService.verifyUser(userExist.id);
      res
        .status(HTTP_STATUSES.ok.code)
        .json({ message: "User verification successfully" });
    } catch (error) {
      next(error);
    }
  }
  static async forgotPasswordEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email } = req.body;
      const userExist = await UserService.findUserByEmail(email);
      if (!userExist) {
        throw new AppError("User doesn't exist", HTTP_STATUSES.NOT_FOUND.code);
      }
      const forgotPasswordCode = UserService.generateSixDigitCode();
      await UserService.updateForgotPasswordCode(
        userExist.id,
        forgotPasswordCode
      );
      await sendForgotPasswordEmail(email, forgotPasswordCode);

      res
        .status(HTTP_STATUSES.ok.code)
        .json({ message: "Update password request sent" });
    } catch (error) {
      next(error);
    }
  }
  static async verifyForgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { forgotPasswordCode, password } = req.body;
      const { email } = req.params;
      if (!forgotPasswordCode || !email || !password) {
        throw new AppError(
          "Provide all required information",
          HTTP_STATUSES.BAD_REQUEST.code
        );
      }
      const userExist = await UserService.findUserByEmail(email);
      if (!userExist) {
        throw new AppError("User doesn't exist", HTTP_STATUSES.NOT_FOUND.code);
      }
      if (forgotPasswordCode !== userExist.forgot_password_code) {
        throw new AppError(
          "Cann't verify wrong code",
          HTTP_STATUSES.BAD_REQUEST.code
        );
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await UserService.updatePassword(userExist.id, hashedPassword);

      res
        .status(HTTP_STATUSES.ok.code)
        .json({ message: "Update password request sent" });
    } catch (error) {
      next(error);
    }
  }
  static async changePassword(
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { password } = req.body;
      const userExist = await UserService.findUserById(req.user.id);
      if (!userExist) {
        throw new AppError("User doesn't exist", HTTP_STATUSES.NOT_FOUND.code);
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await UserService.updatePassword(userExist.id, hashedPassword);

      res
        .status(HTTP_STATUSES.ok.code)
        .json({ message: "Password changed successfully" });
    } catch (error) {
      next(error);
    }
  }

  static async searchUser(
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userEmail } = req.query;
      if (!userEmail || typeof userEmail !== "string") {
        throw new AppError("No such user found!", HTTP_STATUSES.NOT_FOUND.code);
      }
      const userId: number = parseInt(req.user.id);
      const userEmails = await UserService.findAllUser(userId, userEmail);
      // console.log(userEmails);
      res.status(HTTP_STATUSES.ok.code).json({
        message: "all users data fetched Successfully",
        data: userEmails,
      });
    } catch (error) {
      next(error);
    }
  }
  static async allUser(
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const allUsers = await UserService.findAllUsers();
      // console.log(userEmails);
      res.status(HTTP_STATUSES.ok.code).json({
        message: "all users data fetched Successfully",
        data: allUsers,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
