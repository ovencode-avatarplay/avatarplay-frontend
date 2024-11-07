import React, {useEffect, useRef} from 'react';
import {Box, Avatar} from '@mui/material';
import styles from '@chats/Styles/StyleChat.module.css';
import ChatMessageBubble from './ChatMessageBubble';
import {ContactPhoneSharp} from '@mui/icons-material';
import {MessageGroup} from './ChatTypes';

interface ChatAreaProps {
  messages: MessageGroup;
  bgUrl: string;
  iconUrl: string;
  isHideChat: boolean;

  onToggleBackground: () => void;
  isLoading: boolean; // 로딩 상태 추가
}

const ChatArea: React.FC<ChatAreaProps> = ({messages, bgUrl, iconUrl, isHideChat, onToggleBackground, isLoading}) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [messages]);

  useEffect(() => {
    console.log(isLoading);
  }, [isLoading]);

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

            {isLoading === true && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  marginBottom: 2,
                }}
              >
                <Avatar
                  alt="Partner Avatar"
                  src={iconUrl}
                  sx={{
                    width: 32,
                    height: 32,
                    marginRight: 1,
                    border: '1px solid',
                    borderColor: 'black',
                  }}
                />
                <Box
                  sx={{
                    display: 'inline-block',
                    padding: '8px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', // partner의 말풍선 배경색
                    color: '#FFFFFF',
                    fontSize: '0.8em',
                  }}
                >
                  <span className={styles.loadingDots}>
                    <span>●</span>
                    <span>●</span>
                    <span>●</span>
                  </span>
                </Box>
              </Box>
            )}

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
