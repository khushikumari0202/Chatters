import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv/config';
import { connectDB } from './lib/db.js';
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import { Server } from 'socket.io';


const app = express();
const server = http.createServer(app);

//Socket.io setup
export const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

//store online users
export const userSocketMap = {}; //{ userId: socketId }

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    console.log('User connected: ', userId);

    if(userId) userSocketMap[userId] = socket.id;

    //emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("User disconnected: ", userId);
        delete userSocketMap[userId];
        //emit online users to all connected clients
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})


//Middleware
app.use(express.json({limit: '4mb'}));
app.use(cors());

//routes
app.use('/api/status', (req, res)=> res.send("Server is running"));
app.use('/api/auth', userRouter)
app.use('/api/messages', messageRouter)

// MongoDB connection
await connectDB()


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});