import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "./config/passport-setup.js";
import session from "express-session";
import axios from 'axios';
import dotenv from "dotenv";

dotenv.config({
    path: './.env'
})

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
import { asyncHandler } from "./util/asyncHandler.js";
import { apiResponse } from "./util/apiResponse.js";

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

app.get('/api/v1/geocode', asyncHandler(async(req, res) => {
    const {address} = req.query
    const apiKey = process.env.OPENCAGE_API_KEY

    const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
        params: {q: address, key: apiKey}
    })

    return res
        .status(200)
        .json(new apiResponse(200, response.data, "Geocoding done successfully"))
}))

app.get('/api/v1/whether', asyncHandler(async(req, res) => {
    const {lat, lng} = req.query
    const apiKey = process.env.WHETHER_API_KEY

    const response = await axios.get('http://api.weatherstack.com/current', {
        params: {
            access_key: apiKey,
            query: `${lat},${lng}`
        }
    })

    return res
        .status(200)
        .json(new apiResponse(200, response.data, "Whether information fetch successfully"))
}))

export {app}