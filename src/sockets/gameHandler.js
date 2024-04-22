export default function gameHandler(io, socket, room) {
    const { username } = socket.request.session;

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
}

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
