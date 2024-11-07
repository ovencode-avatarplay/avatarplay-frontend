import React, {useEffect, useRef} from 'react';
import {Box, Avatar} from '@mui/material';
import styles from '@chats/Styles/StyleChat.module.css';
import ChatMessageBubble from './ChatMessageBubble';

interface Message {
  text: string;
  sender: 'user' | 'partner' | 'narration' | 'system' | 'introPrompt' | 'userNarration';
}

interface MessageGroup {
  Messages: Message[];
  emoticonUrl: string[];
}

interface ChatAreaProps {
  messages: MessageGroup;
  bgUrl: string;
  iconUrl: string;
  isHideChat: boolean;

  onToggleBackground: () => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({messages, bgUrl, iconUrl, isHideChat, onToggleBackground}) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [messages]);

  return (
    <>
      {isHideChat === false && (
        <Box
          className={styles.chatArea}
          onDoubleClick={() => {
            // isHideChat이 false일 때만 onToggleBackground 호출
            if (isHideChat === false) {
              onToggleBackground();
            }
          }}
          sx={{
            backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0) 80%), url(${bgUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            height: '100%',
            width: '100%',
            position: 'relative',
            fontFamily: 'Noto Sans KR, sans-serif',
            overflow: 'hidden',
          }}
        >
          {/* Fixed space at the top */}
          <Box sx={{height: '72px', width: '100%'}} />

          {/* Scrollable content */}
          <Box
            sx={{
              height: 'calc(100% - 72px)',
              overflowY: 'auto',
              position: 'absolute',
              top: '72px',
              left: 0,
              right: 0,
              paddingLeft: '16px', // 좌측 간격 추가
              paddingRight: '16px', // 우측 간격 추가
            }}
          >
            {messages.Messages.map((msg, index) => (
              <ChatMessageBubble
                text={msg.text}
                sender={msg.sender}
                index={index}
                iconUrl={iconUrl}
                emoticonUrl={messages.emoticonUrl[index]}
              />
            ))}
            <div ref={bottomRef} />
          </Box>
        </Box>
      )}
      {isHideChat === true && (
        <Box
          className={styles.chatArea}
          onDoubleClick={() => {
            if (isHideChat === true) {
              onToggleBackground();
            }
          }}
          sx={{
            backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0) 80%), url(${bgUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            height: '100%',
            width: '100%',
            position: 'relative',
            fontFamily: 'Noto Sans KR, sans-serif',
            overflow: 'hidden',
          }}
        ></Box>
      )}
    </>
  );
};

export default ChatArea;
