import React, {useEffect, useRef} from 'react';
import {Box} from '@mui/material';
import styles from '@chats/Styles/StyleChat.module.css';

interface ChatAreaProps {
  messages: string[]; // 이제 문자열 배열을 받습니다.
}

interface Message {
  text: string;
  sender: 'user' | 'partner' | 'narration'; // 나래이션 타입 추가
}

// 메시지를 파싱하는 함수
const parseMessage = (message: string): Message | null => {
  try {
    const parsedMessage = JSON.parse(message);

    // Answer가 있을 경우 partner 메시지
    if (parsedMessage.Answer) {
      return {
        text: parsedMessage.Answer,
        sender: 'partner',
      };
    }

    // 따옴표로 묶여 있지 않거나 **로 묶여 있으면 narration 메시지
    if (!message.startsWith('"') && !message.endsWith('"') && message.startsWith('**') && message.endsWith('**')) {
      return {
        text: message.replace(/\*\*/g, ''), // **를 제거
        sender: 'narration',
      };
    }

    // 그 외에는 user 메시지
    return {
      text: message,
      sender: 'user',
    };
  } catch (error) {
    console.error('Failed to parse message:', error);
    return null; // 파싱 실패 시 null 반환
  }
};

// 이전 메시지를 변환하는 함수
const convertPrevMessages = (prevMessages: string[]): Message[] => {
  return prevMessages.map(msg => parseMessage(msg) || {text: '', sender: 'narration'});
};

const ChatArea: React.FC<ChatAreaProps> = ({messages}) => {
  const bottomRef = useRef<HTMLDivElement | null>(null); // 스크롤 참조용 ref
  const parsedMessages = convertPrevMessages(messages); // 전달된 문자열을 파싱하여 메시지로 변환

  console.log('messages1', messages);
  useEffect(() => {
    // 새로운 메시지가 추가될 때마다 스크롤을 마지막 메시지로 이동
    bottomRef.current?.scrollIntoView({behavior: 'smooth'});
    console.log('messages2', messages);
  }, [messages]);

  return (
    <Box className={styles.chatArea}>
      {parsedMessages.map((msg, index) => (
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
            }}
          >
            <div>{msg.text}</div>
          </Box>
        </Box>
      ))}
      <div ref={bottomRef} />
    </Box>
  );
};

export default ChatArea;
