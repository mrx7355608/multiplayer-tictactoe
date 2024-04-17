import { Server } from "socket.io";
import app from "./app.js";
import http from "http";
import sessionMiddleware from "./sessionMiddleware.js";

const httpServer = http.createServer(app);
const io = new Server(httpServer);

io.engine.use(sessionMiddleware);

const room = {
    id: 1,
    user1: null,
    user2: null,
    board: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ],
};

io.on("connection", (socket) => {
    const { username } = socket.request.session;
    console.log(`[NEW CONNECTION] ${username} connected`);

    socket.on("play-game", () => {
        console.log(`[PLAY GAME] ${username} wants to play game`);
        socket.join(room.id);
        if (room.user1) {
            room.user2 = username;
        } else {
            room.user1 = username;
        }

        if (room.user1 && room.user2) {
            io.to(room.id).emit("start-game", { room });
        }
        io.to(room.id).emit("new-user-joined", { room });
    });

    socket.on("player-make-move", ({ row, col }) => {
        if (username === room.user1) {
            room.board[row][col] = "X";
        } else {
            room.board[row][col] = "O";
        }

        console.log(room.board);
        io.to(room.id).emit("board-updated", { board: room.board });
    });

    socket.on("disconnect", () => {
        console.log(`[DISCONNECTED] ${username} disconnected`);
        if (username === room.user1) {
            room.user1 = null;
        } else {
            room.user2 = null;
        }
        io.to(room.id).emit("player-left", { room });
    });
});

httpServer.listen(8000, () => {
    console.log("listening on port 8000...");
});
