import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import styles from '@chats/Styles/StyleChat.module.css';

interface Message {
  text: string;
  sender: 'user' | 'partner';
}

interface ChatAreaProps {
  messages: Message[];
}

const ChatArea: React.FC<ChatAreaProps> = ({ messages }) => {
  const bottomRef = useRef<HTMLDivElement | null>(null); // 스크롤 참조용 ref

  useEffect(() => {
    // 새로운 메시지가 추가될 때마다 스크롤을 마지막 메시지로 이동
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]); // messages가 변경될 때마다 호출됨

  return (
    <Box className={styles.chatArea}>
      {messages.map((msg, index) => (
        <Box
          key={index}
          sx={{
            marginBottom: 1,
            textAlign: msg.sender === 'user' ? 'right' : 'left',
            padding: '8px',
            borderRadius: '8px',
            backgroundColor: msg.sender === 'user' ? '#e1ffc7' : '#f0f0f0', // 사용자와 상대에 따라 배경색 설정
          }}
        >
          <div>{msg.text}</div>
        </Box>
      ))}
      {/* 이 요소는 마지막 메시지로 스크롤을 자동으로 이동시키기 위한 요소 */}
      <div ref={bottomRef} />
    </Box>
  );
};

export default ChatArea;
