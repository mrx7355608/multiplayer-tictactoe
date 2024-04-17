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
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
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

    socket.on("player-made-a-move", ({ row, col }) => {
        if (username === room.user1) {
            room.board[row][col] = "X";
        } else {
            room.board[row][col] = "O";
        }
        io.to(room.id).emit("board-updated", { board: room.board });
        const winnerSymbol = checkWinner(room.board);
        if (winnerSymbol === "X") {
            io.to(room.id).emit("game-over", { winner: room.user1 });
        } else if (winnerSymbol === "O") {
            io.to(room.id).emit("game-over", { winner: room.user2 });
        }
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

function checkWinner(board) {
    if (
        board[0][0] &&
        board[0][0] === board[1][1] &&
        board[0][0] === board[2][2]
    ) {
        return board[0][0];
    } else if (
        board[0][2] &&
        board[0][2] === board[1][1] &&
        board[0][2] === board[2][0]
    ) {
        return board[0][2];
    }
}

httpServer.listen(8000, () => {
    console.log("listening on port 8000...");
});
