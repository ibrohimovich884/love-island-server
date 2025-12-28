import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: "http://localhost:5173" } // React Vite bo'lsa 5173, Create React App bo'lsa 3000
});

app.use(cors());
app.use(express.json());

// API yo'llari (Tepada bo'lishi kerak)
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Asosiy sahifa uchun xabar (Eng pastga tushiring yoki o'chirib tashlang)
app.get('/', (req, res) => {
    res.send('Server is running and API is ready!');
});

// Socket.io mantiqi...
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    // ... qolgan kodlar
});

const PORT = 5000;
httpServer.listen(PORT, '0.0.0.0', () => console.log(`ESM Server running on port ${PORT} 🚀`));