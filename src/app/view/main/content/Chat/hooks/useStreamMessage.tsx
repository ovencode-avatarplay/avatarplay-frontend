import {SendChatMessageReq, SendChatMessageResSuccess} from '@/app/NetWork/ChatNetwork';
import {useEffect, useState} from 'react';
import {MessageGroup} from '../MainChat/ChatTypes';
import {Message} from 'postcss';
import {setRegeneratingQuestion} from '@/redux-store/slices/ModifyQuestion';
import {ESystemError} from '@/app/NetWork/ESystemError';

type StreamMessageProp = {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;

  handleSendMessage: (message: string, isMyMessage: boolean, isClearString: boolean, isShowDate: boolean) => void;
  isSendingMessage: React.MutableRefObject<boolean>; // ref 타입으로 쓰기가능형태로 받아오기

  setChatId: React.Dispatch<React.SetStateAction<number>>;

  parsedMessages: MessageGroup;
  setParsedMessages: React.Dispatch<React.SetStateAction<MessageGroup>>;
  parsedMessagesRef: React.MutableRefObject<MessageGroup>;

  TempIdforSendQuestion: number;
};

export const useStreamMessage = ({
  isLoading,
  setIsLoading,
  handleSendMessage,
  isSendingMessage,
  setChatId,
  parsedMessages,
  setParsedMessages,
  parsedMessagesRef,
  TempIdforSendQuestion,
}: StreamMessageProp) => {
  const [streamKey, setStreamKey] = useState<string>(''); // streamKey 상태 추가
  const [retryStreamKey, setRetryStreamKey] = useState<string>(''); // streamKey 상태 추가

  useEffect(() => {
    if (streamKey === '') return;
    console.log('stream key : ', streamKey);

    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_CHAT_API_URL}/api/v1/Chatting/stream?streamKey=${streamKey}`,
    );

    eventSource.onmessage = async event => {
      try {
        setIsLoading(false);
        if (!event.data) {
          throw new Error('Received null or empty data');
        }

        const newMessage = JSON.parse(event.data);

        // ResultCode 기반 에러 처리
        if (newMessage.resultCode !== undefined && newMessage.resultCode !== 0) {
          switch (newMessage.resultCode) {
            case 1:
              alert('Invalid: 번호의 키가 존재하지 않습니다.');
              break;
            case 2:
              alert('NotFound: 에피소드 잠금이 열리지 않았습니다.');
              break;
            case 3:
              alert('NotExist: LLM 모델을 찾을 수 없습니다.');
              break;
            case 10:
              alert('DBError: ResultMessage를 찾을 수 없습니다.');
              break;
            default:
              alert('Unknown Error: 예상치 못한 에러가 발생했습니다.');
          }
          return; // 에러 발생 시 메시지 처리를 중단
        }

        // 정상 메시지 처리
        await handleSendMessage(newMessage, false, true, false);

        // '$'로 스트림 종료 여부 확인
        if (newMessage.includes('$') === true) {
          isSendingMessage.current = false;
          eventSource.close();
          console.log('Stream ended normally');
        }
      } catch (error) {
        console.error('Error processing message:', error);
        console.error('Received data:', event.data);
      }
    };

    eventSource.onerror = async error => {
      console.error('Stream encountered an error or connection was lost');
      await handleSendMessage(`${ESystemError.syserr_chat_stream_error}`, false, false, false);
      isSendingMessage.current = false;

      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [streamKey]);

  useEffect(() => {
    if (retryStreamKey === '') return;
    console.log('stream key : ', retryStreamKey);

    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_CHAT_API_URL}/api/v1/Chatting/retryStream?streamKey=${retryStreamKey}`, // 쿼리 파라미터 제대로 추가
    );

    eventSource.onmessage = async event => {
      try {
        if (!event.data) {
          throw new Error('Received null or empty data');
          setIsLoading(false);
        }

        setIsLoading(false);

        const newMessage = JSON.parse(event.data);
        console.log('stream new text====' + newMessage + '====');
        await handleSendMessage(newMessage, false, true, false);
        if (newMessage.includes('$') === true) {
          isSendingMessage.current = false;

          eventSource.close();
          console.log('Stream ended normally');
        }
      } catch (error) {
        console.error('Error processing message:', error);
        console.error('Received data:', event.data);
      }
    };

    eventSource.onerror = error => {
      isSendingMessage.current = false;
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [retryStreamKey]);

  const saveChatStreamInfo = (reqSendChatMessage: SendChatMessageReq, response: SendChatMessageResSuccess) => {
    // 성공적인 응답 처리
    setStreamKey(response.streamKey);
    setChatId(response.chatContentId);

    const currentMessages = parsedMessagesRef.current.Messages;

    const updatedMessages = currentMessages.map(message =>
      message.chatId === TempIdforSendQuestion ? {...message, chatId: response.chatContentId} : message,
    );

    // 상태 업데이트
    setParsedMessages({
      ...parsedMessagesRef.current,
      Messages: updatedMessages,
    });
    setRegeneratingQuestion({
      lastMessageId: response.chatContentId,
      lastMessageQuestion: reqSendChatMessage.text,
    });
  };

  return {streamKey, setStreamKey, retryStreamKey, setRetryStreamKey, saveChatStreamInfo};
};
