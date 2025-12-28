import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import userRoutes from './src/routes/userRoutes.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: "http://localhost:3000" } 
});

app.use(cors());
app.use(express.json());

// API yo'llari
app.use('/api/users', userRoutes);

// Socket.io Room Logic
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_game', (roomId) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = 5000;
httpServer.listen(PORT, () => console.log(`ESM Server running on port ${PORT} 🚀`));