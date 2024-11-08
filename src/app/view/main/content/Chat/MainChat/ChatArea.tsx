import React, {useEffect, useRef, useState} from 'react';
import {Box, Avatar} from '@mui/material';
import styles from '@chats/Styles/StyleChat.module.css';
import ChatMessageBubble from './ChatMessageBubble';
import {MessageGroup} from './ChatTypes';

interface ChatAreaProps {
  messages: MessageGroup;
  bgUrl: string;
  iconUrl: string;
  isHideChat: boolean;
  onToggleBackground: () => void;
  isLoading: boolean; // 로딩 상태 추가
  chatBarCount: number;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  bgUrl,
  iconUrl,
  isHideChat,
  onToggleBackground,
  isLoading,
  chatBarCount,
}) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [selectedBubbleIndex, setSelectedBubbleIndex] = useState<number | null>(null);

  const handleBubbleClick = (index: number) => {
    if (selectedBubbleIndex === null) {
      setSelectedBubbleIndex(index);
    } else {
      setSelectedBubbleIndex(null);
    }
    console.log(index);
  };

  useEffect(() => {
    if (scrollRef.current) {
      const {scrollTop, clientHeight, scrollHeight} = scrollRef.current;
      const isAtBottom = scrollHeight - scrollTop === clientHeight;

      // 스크롤 위치를 유지하기 위해 이전 스크롤 높이 계산
      const previousScrollHeight = scrollHeight;

      // 새 메시지가 추가된 후 스크롤을 업데이트
      if (messages.Messages.length > 0) {
        // 메시지가 추가된 후 스크롤 위치 복원
        if (isAtBottom) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight; // 맨 아래로 이동
        } else {
          // 현재 스크롤 위치에서 얼마나 위로 올라갔는지 계산
          const newScrollHeight = previousScrollHeight + scrollRef.current.scrollHeight;
          scrollRef.current.scrollTop = newScrollHeight - previousScrollHeight + scrollTop;
        }
      }
    }
  }, [messages, chatBarCount]); // messages와 chatBarCount가 변경될 때마다 실행

  useEffect(() => {
    console.log(isLoading);
  }, [isLoading, chatBarCount]);

  console.log('챗바카운트', chatBarCount);

  return (
    <>
      {isHideChat === false && (
        <Box
          className={styles.chatArea}
          onDoubleClick={() => {
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
            ref={scrollRef}
            sx={{
              height: `calc(100% - ${chatBarCount > 0 ? chatBarCount * 72 : 0}px)`,
              overflowY: 'auto',
              position: 'absolute',
              top: '72px',
              left: 0,
              right: 0,
              paddingLeft: '16px',
              paddingRight: '16px',
            }}
          >
            <Box onClick={() => setSelectedBubbleIndex(null)}>
              {messages.Messages.map((msg, index) => (
                <ChatMessageBubble
                  key={index}
                  text={msg.text}
                  sender={msg.sender}
                  index={index}
                  iconUrl={iconUrl}
                  emoticonUrl={messages.emoticonUrl[index]}
                  onClick={e => {
                    e.stopPropagation();
                    handleBubbleClick(index);
                  }}
                  selectedIndex={selectedBubbleIndex} // 현재 선택된 상태 전달
                />
              ))}
            </Box>

            {isLoading && (
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
