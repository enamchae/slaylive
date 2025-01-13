import { WebSocketServer } from "ws";

const server = new WebSocketServer({ port: 8080 });

server.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("message", (message) => {
        console.log(message.toString());
    });
});
console.log("listening");
