import {useEffect, useRef, useState} from 'react';
import {ESystemError} from '@/app/NetWork/ESystemError';

type StreamMessageProp = {
  handleSendMessage: (message: string, isMyMessage: boolean, isClearString: boolean, isShowDate: boolean) => void;
  isSendingMessage: React.MutableRefObject<boolean>; // ref 타입으로 쓰기가능형태로 받아오기
  onMessageProps: (event: MessageEvent, eventSource: EventSource | null) => void;
};

export const useStreamMessage = ({handleSendMessage, isSendingMessage, onMessageProps}: StreamMessageProp) => {
  const [streamKey, setStreamKey] = useState<string>(''); // streamKey 상태 추가
  const [retryStreamKey, setRetryStreamKey] = useState<string>(''); // streamKey 상태 추가
  const eventSource = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!eventSource.current) return;

    eventSource.current.onmessage = onMessage;
  }, [onMessageProps, streamKey]);

  const onMessage = async (event: MessageEvent) => {
    onMessageProps(event, eventSource.current);
  };

  useEffect(() => {
    if (streamKey === '') return;
    console.log('stream key : ', streamKey);
    //let messageCount = 0; // 메시지 수신 횟수 추적
    eventSource.current = new EventSource(
      `${process.env.NEXT_PUBLIC_CHAT_API_URL}/api/v1/Chatting/stream?streamKey=${streamKey}`,
    );

    eventSource.current.onmessage = onMessage;
    eventSource.current.onerror = async error => {
      console.error('Stream encountered an error or connection was lost');
      await handleSendMessage(`${ESystemError.syserr_chat_stream_error}`, false, false, false);
      isSendingMessage.current = false;

      eventSource.current?.close();
    };

    return () => {
      eventSource.current?.close();
    };
  }, [streamKey]);

  useEffect(() => {
    if (retryStreamKey === '') return;

    console.log('stream key : ', retryStreamKey);

    eventSource.current = new EventSource(
      `${process.env.NEXT_PUBLIC_CHAT_API_URL}/api/v1/Chatting/retryStream?streamKey=${retryStreamKey}`, // 쿼리 파라미터 제대로 추가
    );

    eventSource.current.onmessage = onMessage;
    eventSource.current.onerror = error => {
      if (!eventSource.current) return;
      isSendingMessage.current = false;
      eventSource.current.close();
    };

    return () => {
      if (!eventSource.current) return;
      eventSource.current.close();
    };
  }, [retryStreamKey]);

  const changeStreamKey = (streamKey: string) => {
    console.log('streamKey : ', streamKey);
    setStreamKey(streamKey);
  };
  return {streamKey, setStreamKey, retryStreamKey, setRetryStreamKey, changeStreamKey};
};
