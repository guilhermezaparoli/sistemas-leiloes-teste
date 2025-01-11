import { io, Socket } from 'socket.io-client';
import getUserId from './getUserId';

let socket: Socket | null = null;

function getSocket(): Socket {
  if (!socket) {
    socket = io('http://localhost:4000', {
      transports: ['websocket'],
      autoConnect: false,
      query: {
        userId: getUserId()
      } // Não conectar automaticamente
    },);
  }
  return socket;
}

export default getSocket;
