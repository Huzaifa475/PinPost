import {app} from "./app.js";
import dotenv from 'dotenv';
import connectDB from "./database/index.js";
import { Server } from "socket.io";
import { createServer } from "http";

dotenv.config({
    path: './.env'
});

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: `${process.env.ORIGIN}`,
        methods: ['GET', 'POST'],
        transports: ['websocket'],
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log("Server connected successfully!!!");
})

io.on('connect_error', (err) => {
    console.log(`Connect Error: ${err.message}`);
})

const PORT = process.env.PORT || 5000;

connectDB()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Server is running at port ${PORT}`);
        })
    })
    .catch((error) => {
        console.log("MongoDB connection failed!!!", error);
    })
