let reconnectTimer = 10;

export default function connectionHandler(io, socket, room) {
    const { username } = socket.request.session;
    console.log(`[NEW CONNECTION] ${username} connected`);

    // RECONNECT & DISCONNECT HANDLING
    socket.on("disconnect", () => {
        console.log(`[DISCONNECTED] ${username} disconnected`);

        // When a player disconnects, emit a reconnecting event
        // player might be having some internet issues.
        if (username === room.user1) {
            room.user1 = null;
        } else {
            room.user2 = null;
        }
        io.to(room.id).emit("player-reconnecting", {
            room,
            reconnectTimer,
        });
        reconnectTimer -= 1;
        const reconnectInterval = setInterval(() => {
            if (room.user1 && room.user2) {
                clearInterval(reconnectInterval);
                reconnectTimer = 10;
                return;
            }

            io.to(room.id).emit("player-reconnecting", {
                room,
                reconnectTimer,
            });
            reconnectTimer -= 1;

            if (reconnectTimer === 0) {
                if (room.user1 === null) {
                    room.winner = room.user2;
                } else if (room.user2 === null) {
                    room.winner = room.user1;
                }
                io.to(room.id).emit("match-aborted", { room });
                clearInterval(reconnectInterval);
                reconnectTimer = 10;
                resetRoom(room);
            }
        }, 1000);

        // If player have not reconnected withing 10 seconds
        // abort the match
        // setTimeout(() => {
        //     if (room.user1 === null) {
        //         room.winner = room.user2;
        //     } else if (room.user2 === null) {
        //         room.winner = room.user1;
        //     }
        //     io.to(room.id).emit("match-aborted", { room });
        // }, 10000);
    });
}

function resetRoom(room) {
    room.winner = null;
    room.status = "ongoing";
    room.turn = null;

    room.user1 = null;
    room.user2 = null;

    room.board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
    ];
}
