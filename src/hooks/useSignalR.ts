// src/hooks/useSignalR.ts

import {MediaState} from '@/app/NetWork/ProfileNetwork';
import {HubConnectionBuilder, HubConnection, LogLevel} from '@microsoft/signalr';
import {useEffect, useRef, useCallback} from 'react';

type MessageCallback = (payload: any) => void;
type GiftCallback = (payload: any) => void;
type NotificationCallback = (payload: any) => void;
type DeleteMessageCallback = (payload: any) => void;
type DMErrorCallback = (error: {code: string; message: string}) => void;

type SignalREventCallbacks = {
  onMessage?: MessageCallback;
  onSenderGiftStar?: GiftCallback;
  onReceiverGiftStar?: GiftCallback;
  onNotification?: NotificationCallback;
  onMessageDeleted?: DeleteMessageCallback;
};

let globalConnection: HubConnection | null = null;

export function useSignalR(token: string, callbacks?: SignalREventCallbacks) {
  const connectionRef = useRef<HubConnection | null>(null);

  useEffect(() => {
    if (!token) return;

    // 재사용 가능 연결이 있으면 할당
    if (globalConnection) {
      connectionRef.current = globalConnection;
    } else {
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
    }

    const conn = connectionRef.current;

    if (!conn) return;

    // 이벤트 리스너 등록 (중복 방지 위해 off 먼저 호출)
    if (callbacks?.onSenderGiftStar) {
      conn.off('SenderGiftStar');
      conn.on('SenderGiftStar', callbacks.onSenderGiftStar);
    }

    if (callbacks?.onReceiverGiftStar) {
      conn.off('ReceiverGiftStar');
      conn.on('ReceiverGiftStar', callbacks.onReceiverGiftStar);
    }

    if (callbacks?.onMessage) {
      conn.off('ReceiveDMMessage');
      conn.on('ReceiveDMMessage', callbacks.onMessage);
    }

    if (callbacks?.onNotification) {
      conn.off('ReceiveNotification');
      conn.on('ReceiveNotification', callbacks.onNotification);
    }

    if (callbacks?.onMessageDeleted) {
      conn.off('ReceiveDMMessageDeleted');
      conn.on('ReceiveDMMessageDeleted', callbacks.onMessageDeleted);
    }
  }, [token, callbacks]);

  // 외부에서 직접 사용 가능한 메서드
  const joinRoom = async (urlLinkKey: string) => {
    await connectionRef.current?.invoke('JoinRoom', urlLinkKey);
  };

  const leaveRoom = async (urlLinkKey: string) => {
    await connectionRef.current?.invoke('LeaveRoom', urlLinkKey);
  };

  const sendMessage = async (
    urlLinkKey: string,
    message: string,
    emoticonId: number = 0,
    mediaState: MediaState = MediaState.None,
    mediaUrl: string = '',
  ) => {
    await connectionRef.current?.invoke('SendDMMessage', urlLinkKey, message, emoticonId, mediaState, mediaUrl);
  };

  const deleteMessage = async (messageId: number) => {
    await connectionRef.current?.invoke('DeleteDMMessage', messageId);
  };

  const sendGiftStar = async (giftProfileId: number, giftStar: number) => {
    await connectionRef.current?.invoke('SendGiftStar', giftProfileId, giftStar);
  };

  return {
    connection: connectionRef.current,
    joinRoom,
    leaveRoom,
    sendMessage,
    deleteMessage,
    sendGiftStar,
  };
}
