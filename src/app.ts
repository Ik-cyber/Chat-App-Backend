import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import mongoose from 'mongoose';

import dotenv from "dotenv"
dotenv.config()

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoURI: any = process.env.MONGO_URI;
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// Socket.io connection
io.on('connection', (socket) => {
  console.log('User connected', socket.id);

  socket.on('chatMessage', (msg) => {
    io.emit('chatMessage', msg);  // Broadcast to all clients
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Routes and API (can be extended for usenotnr management, etc.)
app.get('/', (req,res) => {
  res.send('Chat app is running');
});

export { server };
