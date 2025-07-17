import * as Y from 'yjs';
import http from 'http';
import { Server, Socket } from 'socket.io';

interface UserData {
  id: string;
  name: string;
}

interface SocketData {
  userId?: string;
  userName?: string;
  currentDocument?: string;
}

/**
 * Initialize the WebSocket server for collaborative editing
 * @param server HTTP server instance
 */
export const initWebsocketServer = (server: http.Server) => {
  // Initialize Socket.io for presence and other real-time features
  const io = new Server<any, any, any, SocketData>(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Handle Socket.io connections
  io.on('connection', (socket: Socket<any, any, any, SocketData>) => {
    console.log('User connected:', socket.id);

    // Handle user joining a document
    socket.on('join-document', (documentId: string, userData: UserData) => {
      socket.join(`document:${documentId}`);
      
      // Notify other users in the document
      socket.to(`document:${documentId}`).emit('user-joined', {
        id: userData.id,
        name: userData.name,
        socketId: socket.id,
      });

      // Send currently active users to the new user
      io.in(`document:${documentId}`).fetchSockets().then((sockets: Socket<any, any, any, SocketData>[]) => {
        const activeUsers = sockets
          .filter((s: Socket<any, any, any, SocketData>) => s.id !== socket.id)
          .map((s: Socket<any, any, any, SocketData>) => ({
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

  return io;
};