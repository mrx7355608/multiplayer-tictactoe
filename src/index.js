import { Server } from "socket.io";
import app from "./app.js";
import http from "http";
import sessionMiddleware from "./sessionMiddleware.js";

const httpServer = http.createServer(app);
const io = new Server(httpServer);

io.engine.use(sessionMiddleware);

io.on("connection", (socket) => {
    const { username } = socket.request.session;
    console.log(`[NEW CONNECTION] ${username} connected`);

    socket.on("disconnect", () => {
        console.log(`[DISCONNECTED] ${username} disconnected`);
    });
});

httpServer.listen(8000, () => {
    console.log("listening on port 8000...");
});
