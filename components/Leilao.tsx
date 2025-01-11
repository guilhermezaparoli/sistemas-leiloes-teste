'use client';

import { useEffect, useState } from 'react';
import socket from '@/utils/getSocket';
import Link from 'next/link';
import getUserId from '@/utils/getUserId';
import getSocket from '@/utils/getSocket';

export default function Leilao({ leilaoId }: { leilaoId: string }) {
  const [lances, setLances] = useState([]);
  const [encerrado, setEncerrado] = useState(false);
  const [novoLance, setNovoLance] = useState('');
  const [ultimoLance, setUltimoLance] = useState<Date | null>(null);
  const [tempoRestante, setTempoRestante] = useState(0);
  const socket = getSocket();

  const formatarTempo = (milissegundos: number) => {
    const minutos = Math.floor(milissegundos / 60000);
    const segundos = Math.floor((milissegundos % 60000) / 1000);
    return `${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
  };

  const enviarLance = async () => {
    const agora = new Date();

    if (ultimoLance && agora.getTime() - ultimoLance.getTime() < 5000) {
      alert('Aguarde 5 segundos antes de enviar outro lance.');
      return;
    }

    const lance = {
      leilaoId,
      usuario: getUserId(),
      valor: parseFloat(novoLance),
    };

    socket.emit('lance', lance);
    setNovoLance('');
    setUltimoLance(agora);
    console.log('Lance enviado:', lance);
  };

  useEffect(() => {
    socket.emit('obter-lances', leilaoId, (lancesDoServidor) => {
      console.log('Lances recebidos do servidor:', lancesDoServidor);
      setLances(lancesDoServidor);
    });

    socket.emit('obter-tempo', leilaoId, (tempo) => {
      console.log('Tempo restante inicial:', tempo);
      setTempoRestante(tempo);
    });

    const interval = setInterval(() => {
      setTempoRestante((prev) => {
        if (prev <= 1000) {
          clearInterval(interval);
          setEncerrado(true); 
          return 0; 
        }
        return prev - 1000; 
      });
    }, 1000);
    

    // Escuta novos lances
    socket.on(`lance-${leilaoId}`, (lance) => {
      setLances((prev) => [...prev, lance]);
    });

    // Escuta encerramento do leilão
    socket.on(`encerrado-${leilaoId}`, ({ vencedor, valorFinal }) => {
      setEncerrado(true);
      alert(`Leilão encerrado! Vencedor: ${vencedor}, Valor final: R$ ${valorFinal}`);
    });

    return () => {
      clearInterval(interval); // Limpa o intervalo ao desmontar o componente
      socket.off(`lance-${leilaoId}`);
      socket.off(`encerrado-${leilaoId}`);
    };
  }, [leilaoId, ultimoLance]);

  return (
    <div>
   
        <>
          <Link href="/leiloes">Voltar</Link>
          <h2 className="text-lg font-bold mt-4"> {encerrado ? "Leilão encerrado" : `Tempo Restante: ${formatarTempo(tempoRestante)}`}  </h2>
          <p>Lances:</p>
          <ul>
            {lances.map((lance, index) => (
              <li key={index}>
                {lance.usuario}: R$ {lance.valor.toFixed(2)}
              </li>
            ))}
          </ul>

          <div className="mt-4">
            <input
              type="number"
              step="0.01"
              placeholder="Digite seu lance"
              value={novoLance}
              onChange={(e) => setNovoLance(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2 mr-2"
            />
            <button
              onClick={enviarLance}
              className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={!novoLance || isNaN(Number(novoLance))}
            >
              Enviar Lance
            </button>
          </div>
        </>
    
    </div>
  );
}
