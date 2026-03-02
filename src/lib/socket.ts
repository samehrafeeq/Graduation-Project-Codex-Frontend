import { io, Socket } from 'socket.io-client';

const SOCKET_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace('/api', '');

let socket: Socket | null = null;

export const getSocket = (): Socket | null => socket;

export const connectSocket = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  if (socket?.connected) return socket;

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
  });

  socket.on('connect', () => {
    console.log('🔌 Socket connected:', socket?.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('🔌 Socket disconnected:', reason);
  });

  socket.on('connect_error', (err) => {
    console.error('🔌 Socket connection error:', err.message);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const joinConversation = (conversationId: number) => {
  socket?.emit('join_conversation', { conversationId });
};

export const leaveConversation = (conversationId: number) => {
  socket?.emit('leave_conversation', { conversationId });
};

export const sendSocketMessage = (conversationId: number, content: string) => {
  socket?.emit('send_message', { conversationId, content });
};

export const emitTyping = (conversationId: number) => {
  socket?.emit('typing', { conversationId });
};
