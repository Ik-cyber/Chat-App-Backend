"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const mongoose_1 = __importDefault(require("mongoose"));
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
    console.log('User connected', socket.id);
    socket.on('chatMessage', (msg) => {
        io.emit('chatMessage', msg); // Broadcast to all clients
    });
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});
// Routes and API (can be extended for usenotnr management, etc.)
app.get('/', (req, res) => {
    res.send('Chat app is running');
});
