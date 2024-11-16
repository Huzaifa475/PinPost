import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "./config/passport-setup.js";
import session from "express-session";

const app = express();

app.use(cors({
    origin: process.env.ORIGIN || "*",
    credentials: true
}))

app.use(express.json({limit: "10mb"}))

app.use(express.urlencoded({extended: true, limit: "10mb"}))

app.use(express.static("public"))

app.use(cookieParser())

app.use(session({
    secret: "xyz",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())

app.use(passport.session())

import userRouter from "./route/user.route.js";

app.use("/api/v1/user", userRouter);

export {app}