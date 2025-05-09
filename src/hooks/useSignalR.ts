// src/hooks/useSignalR.ts

import {MediaState} from '@/app/NetWork/ProfileNetwork';
import {HubConnectionBuilder, HubConnection, LogLevel} from '@microsoft/signalr';
import {useEffect, useRef} from 'react';

type MessageCallback = (payload: any) => void;
type GiftCallback = (payload: any) => void;
type NotificationCallback = (payload: any) => void;

export function useSignalR(token: string) {
  const connectionRef = useRef<HubConnection | null>(null);

  useEffect(() => {
    if (!token) return;

    const connection = new HubConnectionBuilder()
      .withUrl(`${process.env.NEXT_PUBLIC_CHAT_API_URL}/Realtime`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    connectionRef.current = connection;

    connection
      .start()
      .then(() => console.log('✅ SignalR connected'))
      .catch(err => console.error('❌ SignalR connection error', err));

    return () => {
      connection.stop();
    };
  }, [token]);

  const onMessage = (callback: MessageCallback) => {
    connectionRef.current?.on('ReceiveDMMessage', callback);
  };

  const onGift = (callback: GiftCallback) => {
    connectionRef.current?.on('ReceiveGiftRuby', callback);
  };

  const onNotification = (callback: NotificationCallback) => {
    connectionRef.current?.on('ReceiveNotification', callback);
  };

  return {
    connection: connectionRef.current,
    joinRoom: async (urlLinkKey: string) => {
      await connectionRef.current?.invoke('JoinRoom', urlLinkKey);
    },
    leaveRoom: async (urlLinkKey: string) => {
      await connectionRef.current?.invoke('LeaveRoom', urlLinkKey);
    },
    sendMessage: async (
      urlLinkKey: string,
      message: string,
      emoticonId?: number,
      mediaState?: MediaState,
      mediaUrl?: string,
    ) => {
      await connectionRef.current?.invoke(
        'SendDMMessage',
        urlLinkKey,
        message,
        (emoticonId = 0),
        (mediaState = mediaState || MediaState.None),
        (mediaUrl = mediaUrl || ''),
      );
    },
    onMessage,
    onGift,
    onNotification,
  };
}
