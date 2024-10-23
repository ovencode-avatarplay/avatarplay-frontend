import React, {useEffect, useRef} from 'react';
import {Box} from '@mui/material';
import styles from '@chats/Styles/StyleChat.module.css';

interface ChatAreaProps {
  messages: {text: string; sender: 'user' | 'partner' | 'narration'}[]; // Message 타입으로 수정
  isParsing: boolean; // isParsing은 유지, 하지만 사용하지는 않음
  bgUrl: string;
}

// ChatArea 컴포넌트
const ChatArea: React.FC<ChatAreaProps> = ({messages, bgUrl}) => {
  const bottomRef = useRef<HTMLDivElement | null>(null); // 스크롤 참조용 ref

  useEffect(() => {
    // 새로운 메시지가 추가될 때마다 스크롤을 마지막 메시지로 이동
    bottomRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [messages]);

  return (
    <Box
      className={styles.chatArea}
      sx={{
        backgroundImage: `url(${bgUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100%', // 필요에 따라 높이 설정
        width: '100%', // 필요에 따라 너비 설정
        position: 'relative', // 내부의 메시지 배치를 위한 상대적 위치 설정
      }}
    >
      {messages.map((msg, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            justifyContent: msg.sender === 'user' ? 'flex-end' : msg.sender === 'partner' ? 'flex-start' : 'center',
            marginBottom: 1,
          }}
        >
          <Box
            sx={{
              display: 'inline-block',
              padding: '8px',
              borderRadius: '8px',
              maxWidth: '70%',
              backgroundColor: msg.sender === 'user' ? '#e1ffc7' : msg.sender === 'partner' ? '#f0f0f0' : 'transparent',
              textAlign: msg.sender === 'narration' ? 'center' : 'inherit',
              color: msg.sender === 'narration' ? '#888' : 'inherit',
              fontStyle: msg.sender === 'narration' ? 'italic' : 'normal',
              wordWrap: 'break-word',
              whiteSpace: 'pre-wrap',
              fontSize: msg.sender === 'narration' ? '0.8em' : '0.9em', // 나래이션 메시지 크기 조정
            }}
          >
            {/* 텍스트와 이미지를 포함한 메시지 렌더링 */}
            <div dangerouslySetInnerHTML={{__html: msg.text}} />
          </Box>
        </Box>
      ))}
      <div ref={bottomRef} />
    </Box>
  );
};

export default ChatArea;
