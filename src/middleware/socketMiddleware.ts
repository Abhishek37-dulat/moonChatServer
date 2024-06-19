import { Server as SocketIoServer, Socket } from "socket.io";

class SocketHandler {
  private io: SocketIoServer;

  constructor(io: SocketIoServer) {
    this.io = io;
  }

  public handleMessageEvents(): void {
    this.io.on("connection", (socket: Socket) => {
      console.log("New client connected", socket.id);

      socket.on("sendMessage", (message) => {
        console.log("Message received: ", message);
        this.io.emit("receiveMessage", message);
      });

      socket.on("disconnect", () => {
        console.log("client  disconnected", socket.id);
      });
      socket.on("newMessage", (message) => {
        console.log("New message received:", message);
      });
    });
  }
}

export default SocketHandler;
