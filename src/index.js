import app from "./app.js";
import http from "http";

const httpServer = http.createServer(app);

httpServer.listen(8000, () => {
    console.log("listening on port 8000...");
});
