"use strict";
// import express from 'express';
// import http from 'http';
// import cors from 'cors';
// import { Server } from 'socket.io';
// import mongoose from 'mongoose';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
// import dotenv from "dotenv"
// dotenv.config()
// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"]
//   }
// });
// app.use(cors());
// app.use(express.json());
// // MongoDB connection
// const mongoURI: any = process.env.MONGO_URI;
// mongoose.connect(mongoURI)
//   .then(() => console.log('MongoDB connected'))
//   .catch((err) => console.error(err));
// // Socket.io connection
// io.on('connection', (socket) => {
//   console.log('User connected', socket.id);
//   socket.on('chatMessage', (msg) => {
//     console.log(msg)
//     io.emit('chatMessage', msg);  // Broadcast to all clients
//   });
//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//   });
// });
// // Routes and API (can be extended for usenotnr management, etc.)
// app.get('/', (req,res) => {
//   res.send('Chat app is running');
// });
// export { server };
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const mongoose_1 = __importDefault(require("mongoose"));
const Message_1 = __importDefault(require("./models/Message")); // Import the Message model
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
exports.server = server;
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// MongoDB connection
const mongoURI = process.env.MONGO_URI;
mongoose_1.default.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error(err));
// Socket.io connection
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    // Retrieve previous chat messages and send to the client when they connect
    socket.on('fetchMessages', () => __awaiter(void 0, void 0, void 0, function* () {
        const messages = yield Message_1.default.find().sort({ timestamp: 1 });
        socket.emit('chatHistory', messages); // Send the chat history to the connected client
    }));
    // Handle new chat messages
    socket.on('chatMessage', (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { username, content } = data;
        // Save the message to MongoDB
        const newMessage = new Message_1.default({ username, content });
        yield newMessage.save();
        // Emit the message to all connected clients
        io.emit('chatMessage', newMessage); // Emit the saved message object
    }));
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
app.get("/", (req, res) => {
    res.send("Chat App Backend.");
});
// API route to manually fetch messages (optional)
app.get('/api/messages', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield Message_1.default.find().sort({ timestamp: 1 });
        res.status(200).json(messages);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
//# sourceMappingURL=app.js.map