import express, { Application } from "express";
import userRoutes from "./routes/userRoutes";
import imageRoutes from "./routes/imageRoutes";
import chatRoutes from "./routes/chatRoutes";
import messageRoutes from "./routes/messageRoutes";
import sequelize from "./config/database";
import Logger from "./utils/logger";
import errorHandler from "./middleware/errorMiddleware";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import * as fs from "fs";
import path from "path";
import dotenv from "dotenv";
import "./config/associations";
import { Server as SocketIoServer } from "socket.io";

class App {
  public app: Application;
  private accessLogStream!: fs.WriteStream;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
    this.databaseConnect();
    this.handleErrors();
    this.loadEnv();
  }

  private config(): void {
    this.app.use(cors());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(morgan("combined", { stream: this.accessLogStream }));
  }

  private routes(): void {
    this.app.use("/api/users", userRoutes);
    this.app.use("/api/images", imageRoutes);
    this.app.use("/api", chatRoutes);
  }

  public addSocketRoutes(io: SocketIoServer): void {
    this.app.use("/api", messageRoutes(io));
  }

  private handleErrors(): void {
    this.app.use(errorHandler);
  }

  private loadEnv(): void {
    dotenv.config();
    console.log("Environment variables loaded");
    console.warn("Warning: Ensure sensitive info is properly handled");
  }

  private async databaseConnect(): Promise<void> {
    try {
      await sequelize.authenticate();
      Logger.log("Database connected successfully.");
      await sequelize.sync();
    } catch (error: unknown) {
      Logger.error(`Database connection failed: ${error}`);
      process.exit(1);
    }
  }
}

export default App;
