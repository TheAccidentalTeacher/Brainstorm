import * as Y from 'yjs';
import { WebsocketServer } from 'y-websocket/bin/utils';
import http from 'http';
import { Server } from 'socket.io';

/**
 * Initialize the WebSocket server for collaborative editing
 * @param server HTTP server instance
 */
export const initWebsocketServer = (server: http.Server) => {
  // Initialize Y.js WebSocket server
  const wsServer = new WebsocketServer({
    server,
    path: '/collaboration',
    pingTimeout: 30000,
  });

  // Initialize Socket.io for presence and other real-time features
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Handle Socket.io connections
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle user joining a document
    socket.on('join-document', (documentId: string, userData: { id: string; name: string }) => {
      socket.join(`document:${documentId}`);
      
      // Notify others that user joined
      socket.to(`document:${documentId}`).emit('user-joined', {
        id: userData.id,
        name: userData.name,
        socketId: socket.id,
      });

      // Send currently active users to the new user
      io.in(`document:${documentId}`).fetchSockets().then((sockets) => {
        const activeUsers = sockets
          .filter((s) => s.id !== socket.id)
          .map((s) => ({
            id: s.data.userId,
            name: s.data.userName,
            socketId: s.id,
          }));
        
        socket.emit('active-users', activeUsers);
      });

      // Store user data in socket
      socket.data.userId = userData.id;
      socket.data.userName = userData.name;
      socket.data.currentDocument = documentId;
    });

    // Handle user leaving a document
    socket.on('leave-document', (documentId: string) => {
      socket.leave(`document:${documentId}`);
      socket.to(`document:${documentId}`).emit('user-left', socket.id);
    });

    // Handle cursor position updates
    socket.on('cursor-update', (documentId: string, position: { x: number; y: number }) => {
      socket.to(`document:${documentId}`).emit('cursor-moved', {
        userId: socket.data.userId,
        socketId: socket.id,
        position,
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      
      if (socket.data.currentDocument) {
        socket.to(`document:${socket.data.currentDocument}`).emit('user-left', socket.id);
      }
    });
  });

  return { wsServer, io };
};