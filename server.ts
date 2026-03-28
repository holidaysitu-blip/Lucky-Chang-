import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const PORT = 3000;

  // Real-time Presence and Bumping Logic
  const activeUsers = new Map();

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join', (userData) => {
      activeUsers.set(socket.id, { ...userData, id: socket.id });
      io.emit('presence_update', Array.from(activeUsers.values()));
    });

    socket.on('bump_request', (targetId) => {
      const sender = activeUsers.get(socket.id);
      if (sender) {
        io.to(targetId).emit('bump_received', sender);
      }
    });

    socket.on('bump_accept', (targetId) => {
      const acceptor = activeUsers.get(socket.id);
      io.to(targetId).emit('bump_confirmed', acceptor);
    });

    socket.on('send_message', ({ targetId, message }) => {
      const sender = activeUsers.get(socket.id);
      io.to(targetId).emit('receive_message', {
        senderId: socket.id,
        senderName: sender?.name,
        message
      });
    });

    socket.on('disconnect', () => {
      activeUsers.delete(socket.id);
      io.emit('presence_update', Array.from(activeUsers.values()));
      console.log('User disconnected:', socket.id);
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
