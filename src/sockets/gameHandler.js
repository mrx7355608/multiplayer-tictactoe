import GameUtils from "./gameUtilsFactory.js";

export default function gameHandler(io, socket, room) {
    const { username } = socket.request.session;
    const gameUtils = GameUtils(room, username);

    socket.on("player-made-a-move", ({ row, col }) => {
        // Prevent user from making a move when its not his turn
        if (room.turn !== username) {
            io.to(username).emit("move-error", {
                message: "Wait for your turn",
            });
            return;
        }

        // Check if cell is empty or not before registering
        // user's move
        if (gameUtils.isCellEmpty(row, col) === false) {
            io.to(username).emit("move-error", {
                message: "Choose a different box",
            });
            return;
        }

        // Update board with moves of the users;
        gameUtils.registerUserMoves(row, col);

        // Switch turn after a move has been made
        gameUtils.switchTurns();

        // Emit an event to update boards on UI of both users
        io.to(room.id).emit("board-updated", { room });

        // Check for winner
        const winnerSymbol = gameUtils.checkWinner();
        if (winnerSymbol) {
            if (winnerSymbol === "X") {
                room.winner = room.user1;
            } else {
                room.winner = room.user2;
            }
            io.to(room.id).emit("game-over", { winner: room.winner });
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
}
