'use client';

import React, {useCallback, useEffect, useState} from 'react';
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
  const [isNarrationActive, setIsNarrationActive] = useState<{active: boolean}>({active: false}); // 나레이션 활성화 상태
  // let isNarrationActive = false;

  const userId = useSelector((state: RootState) => state.user.userId);
  const episodeId = useSelector((state: RootState) => state.chatting.episodeId);
  const handleBackClick = useBackHandler();

  const cleanString = (input: string): string => {
    // 1. 개행 문자 제거
    let cleaned = input.replace(/\n/g, '');

    // 2. 마지막 글자가 '#'이면 제거
    if (cleaned.endsWith('#')) {
      cleaned = cleaned.slice(0, -1);
    }

    return cleaned;
  };

  const handleSendMessage = (message: string, isMyMessage: boolean, isParsing: boolean) => {
    console.log('new:' + message);
    if (!message || typeof message !== 'string') return;

    // 나레이션 활성화 상태에 따라 sender 설정
    const newMessage: Message = {
      text: isParsing ? `파싱된 메시지: ${message}` : message,
      sender: isMyMessage ? 'user' : isNarrationActive.active ? 'narration' : 'partner',
    };

    setParsedMessages(prev => {
      const newMessages = [...prev];

      // 문자열을 slpit 해서 따로 처리해야하는지 확인
      newMessage.text = cleanString(newMessage.text); // 없앨 부분 없애줌

      const splitMessage = splitByAsterisk(newMessage.text);
      const splitMessageLeft = splitMessage.beforeAsterisk;
      const splitMessageRight = splitMessage.afterAsterisk;

      console.log('====' + newMessage.text + '====');
      console.log('====' + splitMessageLeft + '====');
      console.log('====' + splitMessageRight + '====');

      const isNewWordBallon: boolean = message.includes('*'); // *가 포함되어 있으면 적절한 위치에서 isNarrationActive.active 상태를 갱신해줘야 한다.
      // 내 메시지
      if (isMyMessage === true) {
        newMessages.push(newMessage);
      }
      // 상대 매시지
      else {
        // 기존 말풍선에 추가
        newMessages[newMessages.length - 1].text += `${splitMessageLeft}`;

        if (isNewWordBallon === true) {
          isNarrationActive.active = !isNarrationActive.active;
          const newMessage2: Message = {
            text: isParsing ? `파싱된 메시지: ${splitMessageRight}` : splitMessageRight,
            sender: isMyMessage ? 'user' : isNarrationActive.active ? 'narration' : 'partner',
          };

          newMessages.push(newMessage2);
        }
      }

      return newMessages; // 업데이트된 메시지 배열 반환
    });

    // 파싱 상태 설정
    setParsingState(isParsing);
    //setIsNarrationActive({...isNarrationActive});
  };

  const splitByAsterisk = (splitMessage: string) => {
    // '*'을 기준으로 문자열을 나누기
    const parts = splitMessage.split('*');

    // 나눈 부분에서 앞과 뒤의 문자열을 반환
    return {
      beforeAsterisk: parts[0], // '*' 앞의 문자열
      afterAsterisk: parts.slice(1).join('*'), // '*' 뒤의 문자열 (여러 개의 '*'이 있을 수 있음)
    };
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
