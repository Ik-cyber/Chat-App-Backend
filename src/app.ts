// import express from 'express';
// import http from 'http';
// import cors from 'cors';
// import { Server } from 'socket.io';
// import mongoose from 'mongoose';

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

import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import Message from './models/Message'; // Import the Message model

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
  console.log('User connected:', socket.id);

  // Retrieve previous chat messages and send to the client when they connect
  socket.on('fetchMessages', async () => {
    const messages = await Message.find().sort({ timestamp: 1 });
    socket.emit('chatHistory', messages);  // Send the chat history to the connected client
  });

  // Handle new chat messages
  socket.on('chatMessage', async (data) => {
    const { username, content } = data;

    // Save the message to MongoDB
    const newMessage = new Message({ username, content });
    await newMessage.save();

    // Emit the message to all connected clients
    io.emit('chatMessage', newMessage);  // Emit the saved message object
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Chat App Backend.")
})

// API route to manually fetch messages (optional)
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export { server };
