import React, {useEffect, useRef} from 'react';
import {Box} from '@mui/material';
import styles from '@chats/Styles/StyleChat.module.css';

interface ChatAreaProps {
  messages: {text: string; sender: 'user' | 'partner' | 'narration' | 'system'}[]; // 'system' 추가
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
              backgroundColor:
                msg.sender === 'user'
                  ? 'rgba(80, 80, 80, 0.8)' // 사용자 메시지: 회색(80% 불투명도)
                  : msg.sender === 'partner'
                  ? 'rgba(0, 0, 0, 0.8)' // 파트너 메시지: 검은색(80% 불투명도)
                  : msg.sender === 'narration'
                  ? 'rgba(100, 100, 100, 0.8)' // 나레이션: 회색(80% 불투명도)
                  : 'rgba(255, 255, 255, 0.2)', // 시스템: 하얀색(80% 불투명도)
              backdropFilter: msg.sender === 'system' ? 'blur(20px)' : 'none', // 시스템에 블러 효과 추가
              textAlign: msg.sender === 'narration' ? 'center' : 'inherit',
              color:
                msg.sender === 'system'
                  ? '#FFFFFF' // 시스템: 검은색
                  : msg.sender === 'narration'
                  ? '#E0E0E0' // 나레이션: 하얀색에 가까운 회색
                  : '#FFFFFF', // 파트너와 사용자: 흰색
              fontSize: msg.sender === 'narration' || msg.sender === 'system' ? '0.7em' : '0.8em', // 나레이션 메시지 크기 조정
              fontWeight: msg.sender === 'narration' ? 'normal' : 'bold', // 나레이션 메시지의 볼드체 제거
              wordWrap: 'break-word',
              whiteSpace: 'pre-wrap',
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
