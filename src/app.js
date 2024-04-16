import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import session from "express-session";
import { engine } from "express-handlebars";
import path from "path";

const app = express();

import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(morgan("dev"));
app.use(helmet());
app.use(
    session({
        secret: "mysecret",
        resave: false,
        saveUninitialized: false,
    }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (_req, res) => {
    res.render("home");
});

app.get("/login", (_req, res) => {
    res.render("login");
});

app.get("/room/:id", (_req, res) => {
    res.render("room");
});

export default app;
