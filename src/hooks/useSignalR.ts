// 📁 src/hooks/useSignalR.ts
import {HubConnectionBuilder, HubConnection, LogLevel} from '@microsoft/signalr';
import {useEffect, useRef} from 'react';

type MessageCallback = (payload: any) => void;

export function useSignalR(token: string, onMessage: MessageCallback) {
  const connectionRef = useRef<HubConnection | null>(null);

  useEffect(() => {
    const connect = async () => {
      const connection = new HubConnectionBuilder()
        .withUrl(`${process.env.NEXT_PUBLIC_SIGNALR_URL}/realtime-hub`, {
          accessTokenFactory: () => token,
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

      connectionRef.current = connection;

      connection.on('ReceiveDMMessage', onMessage);

      try {
        await connection.start();
        console.log('✅ SignalR connected');
      } catch (err) {
        console.error('❌ SignalR connection error', err);
      }
    };

    if (token) connect();

    return () => {
      connectionRef.current?.stop();
    };
  }, [token, onMessage]);

  const joinRoom = async (roomId: number) => {
    await connectionRef.current?.invoke('JoinRoom', String(roomId));
    console.log(`🔔 Joined room ${roomId}`);
  };

  const sendMessage = async (roomId: number, message: string) => {
    await connectionRef.current?.invoke('SendDMMessage', roomId, message);
  };

  return {
    joinRoom,
    sendMessage,
    connection: connectionRef.current,
  };
}
