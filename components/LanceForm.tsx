'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import getSocket from '@/utils/getSocket';

type LanceFormProps = {
  leilaoId: string;
};

type FormData = {
  valor: number;
};

export default function LanceForm({ leilaoId }: LanceFormProps) {
  const socket = getSocket();
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [isSending, setIsSending] = useState(false);
  const onSubmit = async (data: FormData) => {
    const usuario = data.usuario || socket.id;
    console.log(data, "data");
    setIsSending(true);
    const lance = {
      leilaoId,
      valor: data.valor,
      usuario,
    };

    socket.emit('lance', lance);
    reset();
    setIsSending(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
      <label htmlFor="valor" className="block mb-2 font-medium">
        Lance (R$):
      </label>
      <input
        id="valor"
        type="number"
        step="0.01"
        {...register('valor', { required: true, min: 0.01 })}
        className="border border-gray-300 rounded px-4 py-2 w-full"
      />
      <button
        type="submit"
        disabled={isSending}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
      >
        Enviar Lance
      </button>
    </form>
  );
}
