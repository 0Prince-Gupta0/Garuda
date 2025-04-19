import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import authRoute from './Routes/auth.js';
import userRoute from './Routes/user.js';
import doctorRoute from './Routes/doctor.js';
import reviewRoute from './Routes/review.js';
import bookingRoute from './Routes/booking.js';
import chatRoute from './Routes/chat.js';
import messageRoute from './Routes/message.js'; 

import http from 'http';
import { Server } from 'socket.io';
import path from 'path';



dotenv.config();

const corsOption = {
  origin: true
};

const app = express();





mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    console.log("Connecting to:", process.env.MONGO_URL); // 👀 Debug log
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
  }
};

app.use(cors(corsOption));
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/doctor', doctorRoute);
app.use('/api/v1/review', reviewRoute);
app.use('/api/v1/booking', bookingRoute);
app.use('/api/v1/chat', chatRoute);
app.use('/api/v1/message', messageRoute); 

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST'],
  },
});

let onlineUsers = {};
const idToSocketIdMap = new Map();
const socketidToIdMap = new Map();
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Setup user
  socket.on('setup', (userId) => {
    onlineUsers[userId] = socket.id;
    socket.join(userId);
  });

  // Join chat room
  socket.on('join chat', (roomId) => {
    socket.join(roomId);
  });

  // Send chat message
  socket.on('new message', (newMessage) => {
    const chat = newMessage.chat;
    if (!chat || !chat.participants) return;

    chat.participants.forEach((participant) => {
      const participantId = participant.user._id || participant.user;
      const senderId = newMessage.sender._id || newMessage.sender;

      if (participantId.toString() !== senderId.toString()) {
        io.to(participantId.toString()).emit('message received', newMessage);
      }
    });
  });

  
  socket.on("room:join", (data) => {
    const { chatId, id} = data;
    const room=chatId;
    idToSocketIdMap.set(id, socket.id);
    socketidToIdMap.set(socket.id, id);
    io.to(room).emit("user:joined", { id, socketId:socket.id });
    socket.join(room);
    io.to(socket.id).emit("room:join", data);
  });

  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incomming:call", { from: socket.id, offer });
  });

  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  socket.on("peer:nego:needed", ({ to, offer }) => {
    // console.log("peer:nego:needed", offer);
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans }) => {
    // console.log("peer:nego:done", ans);
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });

  socket.on("end:call", ({ to }) => {
    io.to(to).emit("call:ended", { from: socket.id });
  
    // Optional: cleanup socket maps
    const userId = socketidToIdMap.get(socket.id);
    if (userId) {
      idToSocketIdMap.delete(userId);
      socketidToIdMap.delete(socket.id);
    }
  
    for (const room of socket.rooms) {
      if (room !== socket.id) socket.leave(room);
    }
  });
});


const __dirname1=path.resolve();
if(process.env.NODE_ENV==='prod')
{
  app.use(express.static(path.join('/frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve("frontend","dist","index.html"));
  })
}
 
else{
  app.get('/', (req, res) => {
    res.send('API is working');
  });

}



const port = process.env.PORT || 5000;
server.listen(port, () => {
  connectDB();
  console.log(`Server running on port ${port}`);
});


// app.listen(port, () => {
//   connectDB();
//   console.log(`Server is running on ${port}`);
// });
