import "dotenv/config";
import { Server } from "socket.io";
import app from "./app.js";
import http from "http";
import sessionMiddleware from "./sessionMiddleware.js";
import gameHandler from "./sockets/gameHandler.js";
import roomHandler from "./sockets/roomHandler.js";
import connectionHandler from "./sockets/connectionHandler.js";

const httpServer = http.createServer(app);
const io = new Server(httpServer);

io.engine.use(sessionMiddleware);

const room = {
    id: 1,
    user1: null,
    user2: null,
    board: [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
    ],
    turn: null,
    winner: null,
    status: "ongoing",
};

io.on("connection", (socket) => {
    connectionHandler(io, socket, room);
    roomHandler(io, socket, room);
    gameHandler(io, socket, room);
});

httpServer.listen(process.env.PORT, "0.0.0.0", () => {
    console.log("listening on port 8000...");
});
