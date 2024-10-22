'use client';

import React, {useEffect, useState} from 'react';
import TopBar from '@chats/TopBar/HeaderChat';
import BottomBar from '@chats/BottomBar/FooterChat';
import ChatArea from '@chats/MainChat/ChatArea';
import styles from '@chats/Styles/StyleChat.module.css';
import {useBackHandler} from 'utils/util-1';
import usePrevChatting from '@chats/MainChat/PrevChatting';
import {useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';
import {parseMessage} from '@chats/MainChat/MessageParser'; // 메시지 파서 불러오기

interface Message {
  text: string;
  sender: 'user' | 'partner' | 'narration';
}

const ChatPage: React.FC = () => {
  const [parsedMessages, setParsedMessages] = useState<Message[]>([]); // 파싱된 메시지 배열로 변경
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isParsing, setParsingState] = useState<boolean>(true);
  const [hasFetchedPrevMessages, setHasFetchedPrevMessages] = useState<boolean>(false); // 이전 메시지 불러왔는지 여부 추가

  const userId = useSelector((state: RootState) => state.user.userId);
  const episodeId = useSelector((state: RootState) => state.chatting.episodeId);

  const handleBackClick = useBackHandler();

  const handleSendMessage = (message: string, isMyMessage: boolean, isParsing: boolean) => {
    // 새로 들어오는 메시지를 설정
    const newMessage: Message = {
      text: isParsing ? `파싱된 메시지: ${message}` : message,
      sender: isMyMessage ? 'user' : 'partner',
    };

    console.log('new:', message, 'isMyMessage:', isMyMessage, 'parsing:', isParsing, newMessage);

    // 새로운 메시지를 상태에 추가
    setParsedMessages(prev => {
      // 기존 메시지 배열 복사
      const newMessages = [...prev];

      // 만약 배열이 비어있지 않고 마지막 메시지가 'partner'인 경우
      if (isMyMessage === false && newMessages.length > 0 && newMessages[newMessages.length - 1].sender === 'partner') {
        // 마지막 메시지의 text에 새로운 메시지를 추가
        newMessages[newMessages.length - 1].text += ` ${message}`;
      } else {
        // 그렇지 않은 경우 새로운 메시지를 추가
        newMessages.push(newMessage);
      }

      return newMessages; // 업데이트된 메시지 배열 반환
    });

    // 파싱 상태 설정
    setParsingState(isParsing);
  };

  const handleMoreClick = () => {
    console.log('더보기 버튼 클릭');
  };

  const handleToggleBackground = () => {
    console.log('배경 보기/숨기기 버튼 클릭');
  };

  // usePrevChatting 훅 사용
  const {prevMessages, error} = usePrevChatting(userId, episodeId);

  useEffect(() => {
    if (!hasFetchedPrevMessages && !error && prevMessages.length > 0) {
      // 이전 메시지를 한 번만 파싱하여 상태에 설정
      const parsedPrevMessages = prevMessages.flatMap(msg => parseMessage(msg.message) || []);
      setParsedMessages(parsedPrevMessages);
      setHasFetchedPrevMessages(true); // 이전 메시지를 불러왔음을 표시
    }
  }, [error, prevMessages, hasFetchedPrevMessages]);

  // 현재 메시지를 파싱하고 결합
  const allMessages: Message[] = [...parsedMessages];

  return (
    <main className={styles.chatmodal}>
      <TopBar onBackClick={handleBackClick} onMoreClick={handleMoreClick} onToggleBackground={handleToggleBackground} />
      <ChatArea messages={allMessages} isParsing={isParsing} />
      <BottomBar onSend={handleSendMessage} />
    </main>
  );
};

export default ChatPage;
