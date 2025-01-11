'use client'
import QueryProvider from '@/context/QueryProvider';
import { useEffect } from 'react';
import socket from '@/utils/getSocket';
import getSocket from '@/utils/getSocket';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const socket = getSocket();

    // Conectar apenas se não estiver conectado
    if (!socket.connected) {
      socket.connect();
      console.log(`Socket conectado: ${socket.id}`);
    }

    return () => {
      // Opcional: desconectar ao sair
      // socket.disconnect();
    };
  }, []);

  
  return (
    <html lang="pt-BR">
      <body className="bg-gray-100 text-gray-800">
        <QueryProvider>
          {children}
          {/* <ToastContainer position="top-right" autoClose={3000} /> */}
        </QueryProvider>
      </body>
    </html>
  );
}
