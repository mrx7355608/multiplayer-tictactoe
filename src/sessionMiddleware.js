import session from "express-session";

const sessionMiddleware = session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: false,
});

export default sessionMiddleware;
