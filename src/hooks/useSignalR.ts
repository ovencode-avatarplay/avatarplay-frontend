// src/hooks/useSignalR.ts

import {MediaState} from '@/app/NetWork/ProfileNetwork';
import {HubConnectionBuilder, HubConnection, LogLevel} from '@microsoft/signalr';
import {useEffect, useRef, useCallback} from 'react';

type MessageCallback = (payload: any) => void;
type GiftCallback = (payload: any) => void;
type NotificationCallback = (payload: any) => void;
type DeleteMessageCallback = (payload: any) => void;
type DMErrorCallback = (error: {code: string; message: string}) => void;

let globalConnection: HubConnection | null = null;

export function useSignalR(token: string) {
  const connectionRef = useRef<HubConnection | null>(null);

  useEffect(() => {
    if (!token) return;

    // 이미 연결이 있다면 재사용
    if (globalConnection) {
      connectionRef.current = globalConnection;
      return;
    }

    // 새로운 연결 생성
    const connection = new HubConnectionBuilder()
      .withUrl(`${process.env.NEXT_PUBLIC_CHAT_API_URL}/Realtime`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    connectionRef.current = connection;
    globalConnection = connection;

    connection
      .start()
      .then(() => console.log('✅ SignalR connected'))
      .catch(err => console.error('❌ SignalR connection error', err));

    return () => {
      // 컴포넌트가 언마운트될 때 연결을 닫지 않음
      // 대신 앱이 종료될 때 한 번만 닫도록 함
    };
  }, [token]);

  const onMessage = useCallback((callback: MessageCallback) => {
    connectionRef.current?.on('ReceiveDMMessage', callback);
  }, []);

  const onGift = useCallback((callback: GiftCallback) => {
    connectionRef.current?.on('ReceiveGiftRuby', callback);
  }, []);

  const onNotification = useCallback((callback: NotificationCallback) => {
    connectionRef.current?.on('ReceiveNotification', callback);
  }, []);

  const onMessageDeleted = useCallback((callback: DeleteMessageCallback) => {
    connectionRef.current?.on('ReceiveDMMessageDeleted', callback);
  }, []);

  const onDMError = useCallback((callback: DMErrorCallback) => {
    connectionRef.current?.on('ReceiveDMError', callback);
  }, []);

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
    deleteMessage: async (messageId: number) => {
      await connectionRef.current?.invoke('DeleteDMMessage', messageId);
    },
    onMessage,
    onGift,
    onNotification,
    onMessageDeleted,
    onDMError,
  };
}
