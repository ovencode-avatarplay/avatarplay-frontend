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
const parseMessage = (message: string | null): Message[] | null => {
  if (!message) return null; // null 메시지는 무시

  try {
    const parsedMessage = JSON.parse(message);
    const result: Message[] = [];

    // Answer가 있으면 partner 메시지로 추가
    if (parsedMessage.Answer) {
      result.push({
        text: parsedMessage.Answer,
        sender: 'partner',
      });
    }

    // Question이 있으면 user 메시지로 추가
    if (parsedMessage.Question) {
      result.push({
        text: parsedMessage.Question,
        sender: 'user',
      });
    }

    // 나레이션 처리 (특정 패턴으로 감싸진 부분을 처리)
    const narrationPattern = /\*\*(.*?)\*\*/g;
    let narrationMatch;
    while ((narrationMatch = narrationPattern.exec(parsedMessage.Answer || parsedMessage.Question)) !== null) {
      result.push({
        text: narrationMatch[1], // ** 안의 내용 추출
        sender: 'narration',
      });
    }

    return result;
  } catch (error) {
    console.error('Failed to parse message:', error);
    return null;
  }
};

// 이전 메시지를 변환하는 함수
const convertPrevMessages = (prevMessages: (string | null)[]): Message[] => {
  return prevMessages
    .filter(msg => msg !== null && msg !== '') // null 및 빈 문자열 메시지 필터링
    .flatMap(msg => parseMessage(msg) || []); // 각 메시지를 파싱하고 배열로 병합
};

// ChatArea 컴포넌트
const ChatArea: React.FC<ChatAreaProps> = ({messages}) => {
  const bottomRef = useRef<HTMLDivElement | null>(null); // 스크롤 참조용 ref
  const parsedMessages = convertPrevMessages(messages); // 전달된 문자열을 파싱하여 메시지로 변환

  console.log('parsedMessages', parsedMessages);

  useEffect(() => {
    // 새로운 메시지가 추가될 때마다 스크롤을 마지막 메시지로 이동
    bottomRef.current?.scrollIntoView({behavior: 'smooth'});
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
              fontSize: msg.sender === 'narration' ? '1.1em' : 'inherit', // 나래이션 메시지 크기 조정
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
