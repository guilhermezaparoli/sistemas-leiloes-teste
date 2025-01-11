import { createServer } from 'http';
import { Server } from 'socket.io';
import next from 'next';
import prisma from './utils/prisma.js';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.setMaxListeners(200);

  io.on('connection', (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);
    socket.on('lance', async (data) => {
      try {
        console.log('Novo lance recebido:', data);

        if (!data.leilaoId || !data.usuario || typeof data.valor !== 'number') {
          console.error('Dados inválidos para o lance:', data);
          return;
        }

        const novoLance = await prisma.lance.create({
          data: {
            leilaoId: data.leilaoId,
            usuario: data.usuario,
            valor: data.valor,
          },
        });

        io.emit(`lance-${data.leilaoId}`, novoLance);
        

      } catch (error) {
        console.error('Erro ao salvar o lance:', error.message);
      }
    });

    socket.on('obter-lances', async (leilaoId, callback) => {
      try {
        console.log(`Buscando lances para o leilão: ${leilaoId}`);
        const lances = await prisma.lance.findMany({
          where: { leilaoId }
        });

        callback(lances);
      } catch (error) {
        console.error('Erro ao buscar lances:', error.message);
        callback([]);
      }
    });
    socket.on('obter-tempo', async (leilaoId, callback) => {
      try {
        const leilao = await prisma.leilao.findUnique({
          where: { id: leilaoId },
          select: {
            createdAt: true,
          },
        });
    
        if (!leilao) {
          console.error(`Leilão com id ${leilaoId} não encontrado.`);
          return callback({ error: 'Leilão não encontrado' });
        }
    
    const tempoMaximo = 5 * 60 * 1000; 
    const tempoInicio = new Date(leilao.createdAt).getTime(); 
    const agora = new Date().getTime(); 
    const tempoDecorrido = agora - tempoInicio; 

    const tempoRestante = Math.max(0, tempoMaximo - tempoDecorrido);

    console.log('Tempo máximo:', tempoMaximo);
    console.log('Tempo início (ms):', tempoInicio);
    console.log('Agora (ms):', agora);
    console.log('Tempo decorrido (ms):', tempoDecorrido);
    console.log('Tempo restante (ms):', tempoRestante);

    if(tempoRestante === 0){
      await prisma.leilao.update({
        where: {
          id: leilaoId
        },
        data: {
          status: "Encerrado"
        }
      })
    }
    callback(tempoRestante);
      } catch (error) {
        console.error('Erro ao calcular o tempo restante:', error.message);
        callback({ error: 'Erro ao calcular o tempo restante' });
      }
    });
    

    socket.on('participar-leilao', async (leilaoId) => {
      try {
        const leilao = await prisma.leilao.findUnique({
          where: { id: leilaoId },
        });
  
        if (!leilao) {
          console.error('Leilão não encontrado:', leilaoId);
          return;
        }
  
      } catch (error) {
        console.error('Erro ao calcular o tempo restante:', error.message);
      }
    });
  

    socket.on('disconnect', () => {
      console.log(`Cliente desconectado: ${socket.id}`);
    });
  });

  server.listen(4000, () => {
    console.log('Servidor rodando em http://localhost:4000');
  });
});
