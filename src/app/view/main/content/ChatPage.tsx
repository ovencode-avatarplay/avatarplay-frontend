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

interface Message {
  text: string;
  sender: 'user' | 'partner' | 'narration';
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isParsing, setParsingState] = useState<boolean>(true);

  const userId = useSelector((state: RootState) => state.user.userId);
  const episodeId = useSelector((state: RootState) => state.chatting.episodeId);

  const handleBackClick = useBackHandler();

  const handleSendMessage = (message: string, isParsing: boolean) => {
    const newMessage: Message = {text: isParsing ? `파싱된 메시지: ${message}` : message, sender: 'user'};
    setMessages(prev => [...prev, newMessage]);
    setParsingState(isParsing);
    console.log('파싱상태 변경함 : ', isParsing);
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
    if (error) {
      console.error('Error fetching previous messages:', error);
    }
  }, [error]);

  // 전체 메시지를 결합하여 string[]로 변환
  const allMessages: string[] = [...prevMessages.map(msg => msg.message), ...messages.map(msg => msg.text)];

  return (
    <main className={styles.chatmodal}>
      <TopBar onBackClick={handleBackClick} onMoreClick={handleMoreClick} onToggleBackground={handleToggleBackground} />
      <ChatArea messages={allMessages} isParsing={isParsing} />
      <BottomBar onSend={handleSendMessage} />
    </main>
  );
};

export default ChatPage;
