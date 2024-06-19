import { NextFunction } from "express";
import sequelize from "../config/database";
import User from "../models/userModel";
import { NotFoundError, DatabaseError } from "../utils/errors";
import ImageService from "./imageService";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";

interface UserData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  image_url?: string;
  password: string;
  isVerified: boolean;
  forgot_password_code?: string;
}

class UserService {
  public static async findUserByEmail(email: string): Promise<User | null> {
    try {
      return await User.findOne({
        where: { email },
      });
    } catch (error) {
      this.handleError(error, "Failed to find user by email");
    }
  }

  public static async findUserById(id: number): Promise<User | null> {
    try {
      return await User.findByPk(id);
    } catch (error) {
      this.handleError(error, "Failed to find user by ID");
    }
  }
  public static async updateUserProfile(
    id: number,
    updatedData: Partial<User>
  ): Promise<User> {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }
    try {
      await User.update(updatedData, { where: { id } });
      return (await this.findUserById(id)) as User;
    } catch (error) {
      this.handleError(error, "Failed to update user profile");
    }
  }
  public static async createUser(userData: Partial<User>): Promise<User> {
    try {
      return await User.create(userData as User);
    } catch (error) {
      this.handleError(error, "Failed to create user");
    }
  }

  static async verifyUser(id: number): Promise<void> {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }
    try {
      await User.update({ isVerified: true }, { where: { id } });
    } catch (error) {
      this.handleError(error, "Failed to verify user");
    }
  }

  static generateSixDigitCode(): string {
    const min = 100000;
    const max = 999999;
    return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
  }

  static async updateForgotPasswordCode(
    id: number,
    code: string
  ): Promise<void> {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }
    try {
      await user.update({ forgot_password_code: code }, { where: { id } });
    } catch (error) {
      this.handleError(error, "Failed to update forgot password code");
    }
  }

  static async updatePassword(id: number, newPassword: string): Promise<void> {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }
    try {
      const userDetails = await user.update({
        password: newPassword,
      } as User);
      console.log(userDetails);
    } catch (error) {
      this.handleError(error, "Failed to update password");
    }
  }

  public static async updateUserImage(
    userId: number,
    imageUrl: string
  ): Promise<User> {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new NotFoundError(`User with ID ${userId} not found`);
      }
      user.image_url = imageUrl;
      await user.save();
      return user;
    } catch (error) {
      throw new DatabaseError("Failed to update user image in the database");
    }
  }
  public static async deleteUserImage(userId: number): Promise<void> {
    const t = await sequelize.transaction();
    try {
      const user = await User.findByPk(userId, { transaction: t });
      if (!user) {
        throw new NotFoundError(`User with ID ${userId} not found`);
      }
      if (user.image_url) {
        const ImageServiceRes: number | undefined =
          await ImageService.deleteImage(user.image_url, userId);
        if (ImageServiceRes! >= 200 || ImageServiceRes! <= 300) {
          await user.update(
            {
              image_url: undefined,
            } as User,
            { transaction: t }
          );
          t.commit();
        } else {
          throw new DatabaseError(
            "Failed to delete user image from the database"
          );
        }
      }
    } catch (error) {
      throw new DatabaseError("Failed to delete user image from the database");
    }
  }
  public static async findAllUser(
    userId: number,
    userSearchQuery: string
  ): Promise<User[] | []> {
    try {
      // console.log(userSearchQuery);
      const AllUsers = await User.findAll({
        attributes: { exclude: ["password"] },
        where: {
          email: {
            [Op.like]: `%${userSearchQuery}%`,
          },
        },
      });
      // console.log(AllUsers);
      return AllUsers;
    } catch (error) {
      this.handleError(error, "Failed to fetch data from User Database");
    }
  }

  public static async findAllUsers(): Promise<User[] | []> {
    try {
      const AllUsers = await User.findAll({
        attributes: { exclude: ["password"] },
      });
      return AllUsers;
    } catch (error) {
      this.handleError(error, "Failed to fetch data from User Database");
    }
  }
  public static handleError(error: unknown, message: string): never {
    if (error instanceof Error) {
      throw new DatabaseError(`${message}: ${error.message}`);
    } else {
      throw new DatabaseError(message);
    }
  }
}

export default UserService;
