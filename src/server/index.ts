import WebSocket, { WebSocketServer } from "ws";

const server = new WebSocketServer({ port: 8080 });

server.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("message", (message) => {
        const data = JSON.parse(message.toString());
        console.log(data);

        server.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    });
});
console.log("listening");
