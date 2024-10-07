import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import styles from '@chats/Styles/StyleChat.module.css';

interface Message {
  text: string;
  sender: 'user' | 'partner' | 'narration'; // 나래이션 타입 추가
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
            display: 'flex',
            justifyContent:
              msg.sender === 'user'
                ? 'flex-end' // 사용자의 메시지는 우측 정렬
                : msg.sender === 'partner'
                ? 'flex-start' // 상대방의 메시지는 좌측 정렬
                : 'center', // 나래이션은 중앙 정렬
            marginBottom: 1,
          }}
        >
          <Box
            sx={{
              display: 'inline-block', // 말풍선이 글자 수에 맞게 크기 조절
              padding: '8px',
              borderRadius: '8px',
              maxWidth: '70%', // 말풍선의 최대 너비를 설정 (너무 길어지지 않도록 제한)
              backgroundColor:
                msg.sender === 'user'
                  ? '#e1ffc7' // 사용자 메시지 배경색
                  : msg.sender === 'partner'
                  ? '#f0f0f0' // 상대방 메시지 배경색
                  : 'transparent', // 나래이션은 배경색 없음 (필요시 배경색 추가 가능)
              textAlign: msg.sender === 'narration' ? 'center' : 'inherit', // 나래이션은 가운데 정렬
              color: msg.sender === 'narration' ? '#888' : 'inherit', // 나래이션 텍스트 색상 설정
              fontStyle: msg.sender === 'narration' ? 'italic' : 'normal', // 나래이션은 기울임체 적용
              wordWrap: 'break-word', // 긴 단어를 자동으로 줄바꿈 처리
              whiteSpace: 'pre-wrap', // 줄바꿈을 유지하면서 출력
            }}
          >
            <div>{msg.text}</div>
          </Box>
        </Box>
      ))}
      {/* 이 요소는 마지막 메시지로 스크롤을 자동으로 이동시키기 위한 요소 */}
      <div ref={bottomRef} />
    </Box>
  );
};

export default ChatArea;
