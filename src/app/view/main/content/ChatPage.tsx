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
import {parseMessage} from '@chats/MainChat/MessageParser';

interface Message {
  text: string;
  sender: 'user' | 'partner' | 'narration';
}

const ChatPage: React.FC = () => {
  const [parsedMessages, setParsedMessages] = useState<Message[]>([]);
  const [isParsing, setParsingState] = useState<boolean>(true);
  const [hasFetchedPrevMessages, setHasFetchedPrevMessages] = useState<boolean>(false);
  let [isNarrationActive, setIsNarrationActive] = useState<boolean>(false); // 나레이션 활성화 상태

  const userId = useSelector((state: RootState) => state.user.userId);
  const episodeId = useSelector((state: RootState) => state.chatting.episodeId);
  const handleBackClick = useBackHandler();

  const handleSendMessage = (message: string, isMyMessage: boolean, isParsing: boolean) => {
    console.log('new:', message);

    if (!message || typeof message !== 'string') return;

    // 나레이션 상태 업데이트 로직
    let isChectNarrationOff: boolean = true;
    if (!isMyMessage && message.includes('*') && isNarrationActive === false) {
      isNarrationActive = true; // 상태 업데이트
      isChectNarrationOff = false;
      console.log('나레이션 상태 바꿨습니다:', isNarrationActive);
    }

    // 나레이션 활성화 상태에 따라 sender 설정
    const newMessage: Message = {
      text: isParsing ? `파싱된 메시지: ${message}` : message,
      sender: isMyMessage ? 'user' : isNarrationActive ? 'narration' : 'partner',
    };

    setParsedMessages(prev => {
      const newMessages = [...prev];

      // 상대방 메시지를 상태에 추가 (마지막 메시지와 결합 처리)
      if (!isMyMessage && newMessages.length > 0 && newMessages[newMessages.length - 1].sender === newMessage.sender) {
        newMessages[newMessages.length - 1].text += ` ${message}`;
      } else {
        newMessages.push(newMessage);
      }

      // 나레이션 상태 업데이트 로직
      if (isChectNarrationOff === true && !isMyMessage && message.includes('*')) {
        isNarrationActive = false; // 상태 업데이트
        console.log('나레이션 상태 바꿨습니다:', isNarrationActive);
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
      const parsedPrevMessages = prevMessages.flatMap(msg => parseMessage(msg.message) || []);
      setParsedMessages(parsedPrevMessages);
      setHasFetchedPrevMessages(true);
    }
  }, [error, prevMessages, hasFetchedPrevMessages]);

  return (
    <main className={styles.chatmodal}>
      <TopBar onBackClick={handleBackClick} onMoreClick={handleMoreClick} onToggleBackground={handleToggleBackground} />
      <ChatArea messages={parsedMessages} isParsing={isParsing} />
      <BottomBar onSend={handleSendMessage} />
    </main>
  );
};

export default ChatPage;
