'use client';

import { useEffect, useState } from 'react';
import socket from '@/utils/getSocket';
import Link from 'next/link';
import getSocket from '@/utils/getSocket';

type Lance = {
  valor: number;
  usuario: string;
};

type LanceListProps = {
  leilaoId: string;
};

export default function LanceList({ leilaoId }: LanceListProps) {
  const [lances, setLances] = useState<Lance[]>([]);
  const socket = getSocket();

  useEffect(() => {
    // socket.connect();

    // Adicionar listener para obter lances existentes
    const handleObterLances = (lancesExistentes: Lance[]) => {
      setLances(lancesExistentes);
    };

    socket.emit('obter-lances', leilaoId, handleObterLances);

    // Adicionar listener para novos lances em tempo real
    const handleNovoLance = (lance: Lance) => {
      setLances((prev) => [...prev, lance]);
    };

    socket.on(`lance-${leilaoId}`, handleNovoLance);

    return () => {
      // Remover ouvintes ao desmontar o componente
      socket.off(`lance-${leilaoId}`, handleNovoLance);
    };
  }, [leilaoId]);

  return (
    <div>
      <h2 className="text-lg font-bold mt-4">Lances Recentes</h2>
      <ul className="mt-2">
        {lances.map((lance, index) => (
          <li key={index} className="bg-gray-100 p-2 rounded mb-2">
            {lance.usuario}: R$ {lance.valor.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}
