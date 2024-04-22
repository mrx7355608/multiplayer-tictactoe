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

        if (room.user1 && room.user2) {
            io.to(room.id).emit("start-game", { room });
        }
        io.to(room.id).emit("new-user-joined", { room });
    });
}
