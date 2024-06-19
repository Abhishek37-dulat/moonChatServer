import dotenv from "dotenv";
import App from "./app";
import { createServer } from "http";
import { Server as SocketIoServer } from "socket.io";
import SocketHandler from "./middleware/socketMiddleware";

// Load environment variables
dotenv.config();
console.log("Environment variables loaded");
console.warn("Warning: Ensure sensitive info is properly handled");

const PORT = process.env.PORT || 8001;
const appInstance = new App();

const server = createServer(appInstance.app);
const io = new SocketIoServer(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const socketHandler = new SocketHandler(io);
socketHandler.handleMessageEvents();

appInstance.addSocketRoutes(io);

async function startServer() {
  try {
    server.listen(PORT, () => {
      console.info("Server started on port: ", PORT);
    });
  } catch (err) {
    console.error("Failed to start server: ", err);
  }
}

startServer();
