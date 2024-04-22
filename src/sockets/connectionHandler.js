export default function connectionHandler(io, socket, room) {
    const { username } = socket.request.session;
    console.log(`[NEW CONNECTION] ${username} connected`);

    // RECONNECT & DISCONNECT HANDLING
    socket.on("disconnect", () => {
        console.log(`[DISCONNECTED] ${username} disconnected`);
        io.to(room.id).emit("player-left", { room });

        // if (username === room.user1) {
        //     io.to(room.user2).emit("player-reconnecting", { room, username });
        // } else {
        //     io.to(room.user1).emit("player-reconnecting", { room, username });
        // }

        // setTimeout(() => {
        //     if (username === room.user1) {
        //         room.user1 = null;
        //     } else {
        //         room.user2 = null;
        //     }
        //     io.to(room.id).emit("player-left", { room });
        // }, 5000);
    });
}
