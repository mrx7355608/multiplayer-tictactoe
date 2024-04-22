export default function roomHandler(io, socket, room) {
    const { username } = socket.request.session;

    socket.on("play-game", () => {
        socket.join(room.id);
        socket.join(username);
        if (room.user1) {
            room.user2 = username;
        } else {
            room.user1 = username;
        }
        io.to(room.id).emit("new-user-joined", { room });

        if (room.winner) {
            io.to(username).emit("game-over", { winner: room.winner });
        } else if (room.user1 && room.user2) {
            room.turn = room.user1;
            io.to(room.id).emit("start-game", { room });
        }
    });
}
