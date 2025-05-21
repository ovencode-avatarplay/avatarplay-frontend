// src/hooks/useSignalR.ts

import {MediaState} from '@/app/NetWork/ProfileNetwork';
import {HubConnectionBuilder, HubConnection, LogLevel} from '@microsoft/signalr';
import {useEffect, useRef, useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {setUnread} from '@/redux-store/slices/Notification';
import {setStar} from '@/redux-store/slices/Currency';

type MessageCallback = (payload: any) => void;
type GiftCallback = (payload: any) => void;
type NotificationCallback = (payload: any) => void;
type DeleteMessageCallback = (payload: any) => void;
type DMErrorCallback = (error: {code: string; message: string}) => void;
type SenderGiftCallback = (payload: any) => void;
type ReceiverGiftCallback = (payload: any) => void;

// 여러곳에서 중복처리 해야하는 경우 여기에 등록해서 처리.
type SignalREventCallbacks = {
  onSenderGiftStar?: SenderGiftCallback;
  onReceiverGiftStar?: ReceiverGiftCallback;
};

let globalConnection: HubConnection | null = null;
let connectionCount = 0; // 연결을 사용하는 컴포넌트 수 추적

export function useSignalR(token: string, callbacks: SignalREventCallbacks = {}) {
  const connectionRef = useRef<HubConnection | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!token) return;

    // 이미 연결이 있다면 재사용
    if (globalConnection) {
      connectionRef.current = globalConnection;
      connectionCount++;
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
    connectionCount++;

    connection
      .start()
      .then(() => console.log('✅ SignalR connected'))
      .catch(err => console.error('❌ SignalR connection error', err));

    return () => {
      connectionCount--;
      // 마지막 컴포넌트가 언마운트될 때만 연결 종료
      if (connectionCount === 0) {
        globalConnection?.stop();
        globalConnection = null;
      }
    };
  }, [token]);

  const onMessage = useCallback((callback: MessageCallback) => {
    connectionRef.current?.on('ReceiveDMMessage', callback);
  }, []);

  const onGift = useCallback((callback: GiftCallback) => {
    connectionRef.current?.on('ReceiveGiftRuby', callback);
  }, []);

  const onMessageDeleted = useCallback((callback: DeleteMessageCallback) => {
    connectionRef.current?.on('ReceiveDMMessageDeleted', callback);
  }, []);

  const onDMError = useCallback((callback: DMErrorCallback) => {
    connectionRef.current?.on('ReceiveDMError', callback);
  }, []);

  useEffect(() => {
    // 선물 보내기 이벤트 핸들러 등록
    connectionRef.current?.off('SenderGiftStar');
    connectionRef.current?.on('SenderGiftStar', payload => {
      console.log('💫 SenderGiftStar 수신:', payload);
      const amount = typeof payload === 'number' ? payload : payload?.amountStar ?? payload?.amount;
      if (typeof amount === 'number') {
        dispatch(setStar(amount));
      }
    });

    // 선물 받기 이벤트 핸들러 등록
    connectionRef.current?.off('ReceiverGiftStar');
    connectionRef.current?.on('ReceiverGiftStar', payload => {
      console.log('📦 ReceiverGiftStar 수신:', payload);
      const amount = typeof payload === 'number' ? payload : payload?.amountStar ?? payload?.amount;
      if (typeof amount === 'number') {
        dispatch(setStar(amount));
      }
    });

    // 알림 핸들러는 항상 등록
    connectionRef.current?.off('ReceiveNotification');
    connectionRef.current?.on('ReceiveNotification', payload => {
      console.log('🔔 알림 수신됨 (auto):', payload);
      dispatch(setUnread(true));
    });
  }, [dispatch]);

  const sendGiftStar = async (giftProfileId: number, giftStar: number) => {
    await connectionRef.current?.invoke('SendGiftStar', giftProfileId, giftStar);
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
    deleteMessage: async (messageId: number) => {
      await connectionRef.current?.invoke('DeleteDMMessage', messageId);
    },
    onMessage,
    onGift,
    onMessageDeleted,
    onDMError,
    sendGiftStar,
  };
}
