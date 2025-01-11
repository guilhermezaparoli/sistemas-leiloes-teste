'use client';

import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useState } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

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
        className="mb-4 flex flex-wrap gap-2"
      >
        <Input
          type="text"
          placeholder="Nome do Item"
          value={novoLeilao.nome}
          onChange={(e) => setNovoLeilao({ ...novoLeilao, nome: e.target.value })}
          className="mr-2 max-w-56"
        />
        <Input
          type="number"
          placeholder="Preço de Referência"
          value={novoLeilao.preco}
          onChange={(e) => setNovoLeilao({ ...novoLeilao, preco: Number(e.target.value) })}
          className="mr-2 max-w-56"
        />
        <Button type="submit">Criar Leilão</Button>
      </form>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {leiloes.map((leilao: any) => (
          <Card key={leilao.id} className="shadow">
            <CardHeader>
              <CardTitle>{leilao.nome}</CardTitle>
            </CardHeader>
            <CardContent>
              <p >Preço de Referência: R$ {leilao.preco}</p>
              <p>Status: {leilao.status}</p>
              <a href={`/leiloes/${leilao.id}`} className="text-blue-600 hover:underline">
                Ver detalhes
              </a>
            </CardContent>
          </Card>
        ))}
      </ul>
    </div>
  );
}
