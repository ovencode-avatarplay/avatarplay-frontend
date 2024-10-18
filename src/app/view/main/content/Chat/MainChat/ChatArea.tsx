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

// Answer 필드에서 나레이션과 파트너의 말을 분리하는 함수
const parseAnswer = (answer: string): Message[] => {
  const result: Message[] = [];
  const narrationPattern = /\*(.*?)\*/g;
  let lastIndex = 0;
  let match;

  while ((match = narrationPattern.exec(answer)) !== null) {
    // 나레이션이 나오기 전의 텍스트를 파트너 메시지로 추가
    if (match.index > lastIndex) {
      result.push({
        text: answer.slice(lastIndex, match.index).trim(), // 나레이션 전까지의 텍스트
        sender: 'partner',
      });
    }

    // 나레이션을 추가
    result.push({
      text: match[1], // * * 안의 내용
      sender: 'narration',
    });

    lastIndex = narrationPattern.lastIndex;
  }

  // 나레이션 후 남은 파트너의 메시지를 추가
  if (lastIndex < answer.length) {
    result.push({
      text: answer.slice(lastIndex).trim(),
      sender: 'partner',
    });
  }

  return result;
};

// 메시지를 파싱하는 함수
const parseMessage = (message: string | null): Message[] | null => {
  if (!message) return null; // null 메시지는 무시

  try {
    const parsedMessage = JSON.parse(message);
    const result: Message[] = [];

    // Question이 있으면 user 메시지로 추가
    if (parsedMessage.Question) {
      result.push({
        text: parsedMessage.Question,
        sender: 'user',
      });
    }

    // Answer가 있으면 partner 메시지로 추가하고, 나레이션도 포함
    if (parsedMessage.Answer) {
      result.push(...parseAnswer(parsedMessage.Answer)); // Answer 필드를 파싱하여 처리
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
