"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SocketHandler {
    constructor(io) {
        this.io = io;
    }
    handleMessageEvents() {
        this.io.on("connection", (socket) => {
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
exports.default = SocketHandler;
