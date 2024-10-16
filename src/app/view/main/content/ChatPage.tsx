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
import {EnterEpisodeChattingRes} from '@/app/NetWork/ChatNetwork';

interface Message {
  text: string;
  sender: 'user' | 'partner' | 'narration';
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [prevMessages, setPrevMessages] = useState<Message[]>([]); // 이전 메시지를 저장할 상태

  const userId = useSelector((state: RootState) => state.user.userId);
  const episodeId = useSelector((state: RootState) => state.chatting.episodeId);

  const handleBackClick = useBackHandler();

  const handleSendMessage = (message: string) => {
    // 새로운 메시지를 생성
    const newMessage: Message = {text: message, sender: 'user'};

    // messages에 추가
    setMessages(prev => [...prev, newMessage]);
    console.log('채팅 보내기:', message);
  };

  const handleMoreClick = () => {
    console.log('더보기 버튼 클릭');
  };

  const handleToggleBackground = () => {
    console.log('배경 보기/숨기기 버튼 클릭');
  };

  useEffect(() => {
    // 이전채팅 보기
    if (!isOpen) {
      console.log('채팅창을 열어요', isOpen);
    }
  }, [isOpen]);

  useEffect(() => {
    // 채팅 데이터를 가져오는 함수 호출
    const fetchPrevMessages = async () => {
      const fetchedMessages: EnterEpisodeChattingRes = await usePrevChatting(userId, episodeId); // 메시지를 가져옴

      if (fetchedMessages && fetchedMessages.prevMessageInfoList) {
        // fetchedMessages의 타입 정의
        const formattedMessages: Message[] = fetchedMessages.prevMessageInfoList.map(msg => ({
          text: msg.message, // msg.text가 유효한 필드인지 확인 필요
          sender: 'partner', // partner로 설정
        }));

        setPrevMessages(formattedMessages); // 상태에 저장
      }
    };

    fetchPrevMessages(); // API 호출
  }, [userId, episodeId]); // userId와 episodeId가 변경될 때마다 호출

  // 전체 메시지를 결합하여 string[]로 변환
  const allMessages: string[] = [...prevMessages, ...messages].map(msg => msg.text); // 메시지 텍스트를 배열로 만듭니다.

  return (
    <main className={styles.chatmodal}>
      <TopBar onBackClick={handleBackClick} onMoreClick={handleMoreClick} onToggleBackground={handleToggleBackground} />

      {/* 모든 메시지를 ChatArea에 string[]으로 전달 */}
      <ChatArea messages={allMessages} />

      <BottomBar onSend={handleSendMessage} />
    </main>
  );
};

export default ChatPage;
