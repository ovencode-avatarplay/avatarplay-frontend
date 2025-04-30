// src/hooks/useSignalR.ts

import {HubConnectionBuilder, HubConnection, LogLevel} from '@microsoft/signalr';
import {useEffect, useRef} from 'react';

type MessageCallback = (payload: any) => void;
type GiftCallback = (payload: any) => void;

export function useSignalR(token: string, onMessage?: MessageCallback, onGift?: GiftCallback) {
  const connectionRef = useRef<HubConnection | null>(null);

  useEffect(() => {
    if (!token) {
      console.warn('❗ No token provided for SignalR.');
      return;
    }

    const connection = new HubConnectionBuilder()
      .withUrl(`${process.env.NEXT_PUBLIC_CHAT_API_URL}/Realtime`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    connectionRef.current = connection;
    if (onMessage) connection.on('ReceiveDMMessage', onMessage);
    if (onGift) {
      connection.on('ReceiveGiftRuby', onGift);
    }

    connection
      .start()
      .then(() => console.log('✅ SignalR connected'))
      .catch(err => console.error('❌ SignalR connection error', err));

    return () => {
      connection.stop();
    };
  }, [token, onMessage, onGift]);

  const joinRoom = async (roomId: number) => {
    try {
      await connectionRef.current?.invoke('JoinRoom', String(roomId));
      console.log(`🔔 Joined room ${roomId}`);
    } catch (err) {
      console.error('❌ joinRoom error:', err);
    }
  };

  const leaveRoom = async (roomId: number) => {
    try {
      await connectionRef.current?.invoke('LeaveRoom', String(roomId));
      console.log(`🚪 Left room ${roomId}`);
    } catch (err) {
      console.error('❌ leaveRoom error:', err);
    }
  };

  const sendMessage = async (roomId: number, message: string) => {
    try {
      await connectionRef.current?.invoke('SendDMMessage', roomId, message);
    } catch (err) {
      console.error('❌ sendMessage error:', err);
    }
  };

  return {
    connection: connectionRef.current,
    joinRoom,
    leaveRoom,
    sendMessage,
  };
}
