'use client';

import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useState } from 'react';

export default function Dashboard() {
  const queryClient = useQueryClient();
  const { data: leiloes, isLoading } = useQuery('leiloes', async () => {
    const res = await fetch('/api/leiloes');
    return res.json();
  });

  const mutation = useMutation(
    async (novoLeilao: { nome: string; preco: number }) => {
      const res = await fetch('/api/leiloes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoLeilao),
      });
      return res.json();
    },
    {
      onSuccess: () => queryClient.invalidateQueries('leiloes'),
    }
  );

  const [novoLeilao, setNovoLeilao] = useState({ nome: '', preco: 0 });

  if (isLoading) return <p>Carregando leilões...</p>;

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate(novoLeilao);
          setNovoLeilao({ nome: '', preco: 0 });
        }}
        className="mb-4"
      >
        <input
          type="text"
          placeholder="Nome do Item"
          value={novoLeilao.nome}
          onChange={(e) => setNovoLeilao({ ...novoLeilao, nome: e.target.value })}
          className="border border-gray-300 p-2 rounded mr-2"
        />
        <input
          type="number"
          placeholder="Preço de Referência"
          value={novoLeilao.preco}
          onChange={(e) => setNovoLeilao({ ...novoLeilao, preco: Number(e.target.value) })}
          className="border border-gray-300 p-2 rounded mr-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Criar Leilão
        </button>
      </form>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {leiloes.map((leilao: any) => (
          <li key={leilao.id} className="bg-white p-4 shadow rounded">
            <h2 className="text-lg font-semibold">{leilao.nome}</h2>
            <p>Preço de Referência: R$ {leilao.preco}</p>
            <p>Status: {leilao.status}</p>
            <a href={`/leiloes/${leilao.id}`} className="text-blue-600 hover:underline">
              Ver detalhes
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
