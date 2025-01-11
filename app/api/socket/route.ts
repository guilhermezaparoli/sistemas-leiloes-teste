import { Server as IOServer } from 'socket.io';
import { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';

export const config = {
  api: {
    bodyParser: false,
  },
};

let io: IOServer | undefined;

export async function GET(req: NextApiRequest) {
  if (!io) {
    console.log('Iniciando servidor Socket.IO...');
    const httpServer = req.socket.server;
    io = new IOServer(httpServer);

    io.on('connection', (socket) => {
      console.log(`Cliente conectado: ${socket.id}`);

      socket.on('lance', (data) => {
        console.log('Novo lance:', data);
        io?.emit(`lance-${data.leilaoId}`, data); // Envia para todos os clientes conectados
      });

      socket.on('encerrar-leilao', (data) => {
        console.log('Leilão encerrado:', data);
        io?.emit(`encerrado-${data.leilaoId}`, data); // Notifica encerramento
      });
    });
  }

  return NextResponse.json({ message: 'Socket.IO ativo' });
}
