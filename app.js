import express from 'express'
import mongoose from 'mongoose';
import http from 'http';
import webhookRoutes from './routes/webhook.route.js'
import authRoutes from './routes/auth.route.js'
import cors from 'cors'
import dotenv from 'dotenv';
import { Server } from 'socket.io';

dotenv.config()

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST']
  },
  transports: ['websocket']
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

app.use(cors({
  origin: [
    'http://localhost:5173'
  ]
}))
app.use(express.json());

app.use((req, res, next) => {
  req.io = io;
  next();
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(console.error);

app.use('/webhooks', webhookRoutes);
app.use('/auth', authRoutes)

export default server;
