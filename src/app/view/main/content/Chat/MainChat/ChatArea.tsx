import React, {useEffect, useRef, useState} from 'react';
import {Box, Avatar} from '@mui/material';
import styles from '@chats/Styles/StyleChat.module.css';
import ChatMessageBubble from './ChatMessageBubble';
import {MessageGroup} from './ChatTypes';
import ChatTtsPlayer from './ChatTtsPlayer';
import {GenerateTtsUrl} from './GenerateTtsUrl';

interface ChatAreaProps {
  messages: MessageGroup;
  bgUrl: string;
  iconUrl: string;
  isHideChat: boolean;
  onToggleBackground: () => void;
  isLoading: boolean; // 로딩 상태 추가
  chatBarCount: number;
  transitionEnabled: boolean; // 배경 이미지 전환 여부를 제어하는 프롭
}

const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  bgUrl,
  iconUrl,
  isHideChat,
  onToggleBackground,
  isLoading,
  chatBarCount,
  transitionEnabled, // transitionEnabled 프롭을 추가
}) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [selectedBubbleIndex, setSelectedBubbleIndex] = useState<number | null>(null);

  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleBubbleClick = (index: number) => {
    if (selectedBubbleIndex === null) {
      setSelectedBubbleIndex(index);
    } else {
      setSelectedBubbleIndex(null);
    }
    console.log(index);
  };

  const handlePlayAudio = async (text: string) => {
    const url = await GenerateTtsUrl(text, 'defaultVoice');
    setAudioUrl(url); // ChatTtsPlayer로 전달할 audioUrl 상태 업데이트
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

  const [prevBgUrl, setPrevBgUrl] = useState<string | null>(null);

  useEffect(() => {
    if (bgUrl !== prevBgUrl) {
      setPrevBgUrl(bgUrl); // 새 배경 이미지가 바뀌었을 때 이전 URL을 기록
    }
  }, [bgUrl, prevBgUrl]);

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
            position: 'relative',
            width: '100%',
            height: '100%',
            fontFamily: 'Noto Sans KR, sans-serif',
            overflow: 'hidden',
          }}
        >
          {/* 기존 배경 */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0) 80%), url(${bgUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              opacity: prevBgUrl ? 1 : 0, // 이전 배경 이미지 보이게
              transition: transitionEnabled ? 'opacity 1.5s ease' : 'none', // transitionEnabled가 true일 때만 전환 효과 적용
              zIndex: 1, // 이전 배경 이미지
            }}
          />

          {/* 새 배경 */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0) 80%), url(${bgUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              opacity: prevBgUrl ? 0 : 1, // 새 배경 이미지 처음에 보이지 않도록 설정
              transition: transitionEnabled ? 'opacity 1.5s ease' : 'none', // transitionEnabled가 true일 때만 전환 효과 적용
              zIndex: 2, // 새 배경 이미지
            }}
          />
          {/* Fixed space at the top */}
          <Box sx={{height: '72px', width: '100%'}} />

          <ChatTtsPlayer audioUrl={audioUrl} />
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
              zIndex: 3, // 채팅 메시지가 보이도록 z-index를 더 높게 설정
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
                  onTtsClick={e => {
                    e.stopPropagation();
                    handlePlayAudio(msg.text);
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
