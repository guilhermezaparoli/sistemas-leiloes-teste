'use client'
import Leilao from '@/components/Leilao';
import { useParams } from 'next/navigation';

export default function Page() {
  const { id } = useParams(); // Certifique-se de que o `id` é extraído corretamente
console.log(id);
  return (
    <main className="p-6">
      <Leilao leilaoId={id} />
    </main>
  );
}
