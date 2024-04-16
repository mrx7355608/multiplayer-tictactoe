import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { engine } from "express-handlebars";
import path from "path";
import sessionMiddleware from "./sessionMiddleware.js";

const app = express();

import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(morgan("dev"));
// app.use(helmet());
app.use(sessionMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "views"));

app.get("/login", (_req, res) => {
    res.render("login");
});

app.post("/login", (req, res) => {
    const { username } = req.body;
    req.session.username = username;
    res.redirect("/");
});

// MIDDLEWARE TO ALLOW AUTHENTICATED REQUESTS ONLY
app.use((req, res, next) => {
    if (req.session.username) {
        next();
    } else {
        res.redirect("/login");
    }
});

app.post("/logout", (req, res) => {
    req.session.username = undefined;
    res.redirect("/login");
});

app.get("/", (req, res) => {
    const { username } = req.session;
    res.render("home", { username });
});

app.get("/room/:id", (_req, res) => {
    res.render("room");
});

export default app;
