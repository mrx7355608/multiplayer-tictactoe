export default function GameUtils(room, username) {
    const isCellEmpty = (row, col) => {
        const isEmpty = room.board[row][col] ? false : true;
        return isEmpty;
    };

    const switchTurns = () => {
        if (room.turn === room.user1) {
            room.turn = room.user2;
        } else {
            room.turn = room.user1;
        }
    };

    const registerUserMoves = (row, col) => {
        if (username === room.user1) {
            room.board[row][col] = "X";
        } else {
            room.board[row][col] = "O";
        }
    };

    const checkWinner = () => {
        const board = room.board;

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
    };

    return {
        isCellEmpty,
        switchTurns,
        checkWinner,
        registerUserMoves,
    };
}
