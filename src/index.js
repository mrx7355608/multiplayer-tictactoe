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
        socket.join(username);
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

    socket.on("ask-for-a-rematch", () => {
        if (room.user1 === username) {
            io.to(room.user2).emit("want-a-rematch", { username });
        } else {
            io.to(room.user1).emit("want-a-rematch", { username });
        }
    });

    socket.on("rematch-accepted", () => {
        room.board = [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""],
        ];
        io.to(room.id).emit("rematch-start", { board: room.board });
    });

    socket.on("rematch-rejected", () => {
        io.to(room.id).emit("rematch-cancel");
    });

    // RECONNECT & DISCONNECT HANDLING
    socket.on("disconnect", () => {
        console.log(`[DISCONNECTED] ${username} disconnected`);
        if (username === room.user1) {
            io.to(room.user2).emit("player-reconnecting", { room, username });
        } else {
            io.to(room.user1).emit("player-reconnecting", { room, username });
        }

        // setTimeout(() => {
        //     if (username === room.user1) {
        //         room.user1 = null;
        //     } else {
        //         room.user2 = null;
        //     }
        //     io.to(room.id).emit("player-left", { room });
        // }, 5000);
    });
});

function checkWinner(board) {
    // First diagonal check
    if (
        board[0][0] &&
        board[0][0] === board[1][1] &&
        board[0][0] === board[2][2]
    ) {
        return board[0][0];
    }

    // Second diagonal check
    else if (
        board[0][2] &&
        board[0][2] === board[1][1] &&
        board[0][2] === board[2][0]
    ) {
        return board[0][2];
    }

    // First horizontal line check
    else if (
        board[0][0] &&
        board[0][0] === board[0][1] &&
        board[0][0] === board[0][2]
    ) {
        return board[0][0];
    }

    // Second horizontal line check
    else if (
        board[1][0] &&
        board[1][0] === board[1][1] &&
        board[1][0] === board[1][2]
    ) {
        return board[1][0];
    }

    // Third horizontal line check
    else if (
        board[2][0] &&
        board[2][0] === board[2][1] &&
        board[2][0] === board[2][2]
    ) {
        return board[2][0];
    }

    // First vertical line check
    else if (
        board[0][0] &&
        board[0][0] === board[1][0] &&
        board[0][0] === board[2][0]
    ) {
        return board[0][0];
    }

    // Second vertical line check
    else if (
        board[0][1] &&
        board[0][1] === board[1][1] &&
        board[0][1] === board[2][1]
    ) {
        return board[0][1];
    }

    // Third vertical line check
    else if (
        board[0][2] &&
        board[0][2] === board[1][2] &&
        board[0][2] === board[2][2]
    ) {
        return board[0][2];
    }
}

httpServer.listen(8000, () => {
    console.log("listening on port 8000...");
});
