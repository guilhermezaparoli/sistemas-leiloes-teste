'use client'
import QueryProvider from '@/context/QueryProvider';
import { useEffect } from 'react';
import './../styles/global.css';
import getSocket from '@/utils/getSocket';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const socket = getSocket();
    if (!socket.connected) {
      socket.connect();
      console.log(`Socket conectado: ${socket.id}`);
    }
  }, []);

  
  return (
    <html lang="pt-BR">
      <body className="bg-gray-100 text-gray-800">
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
