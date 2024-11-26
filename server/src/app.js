import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "./config/passport-setup.js";
import session from "express-session";

const app = express();

app.use(cors({
    origin: "*",
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
import postRouter from "./route/post.route.js";
import reviewRouter from "./route/review.route.js";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/review", reviewRouter);

app.use((err, req, res, next) => {
    const statusCode = err.status || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || 'Internal Server Error',
      statusCode: statusCode
    });
    next()
});

export {app}