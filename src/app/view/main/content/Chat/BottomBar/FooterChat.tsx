import React, { useRef } from 'react';
import { Box, Button, TextField, IconButton } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CameraIcon from '@mui/icons-material/Camera';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import styles from '@chats/Styles/StyleChat.module.css';

interface BottomBarProps {
  onSend: (message: string) => void;
}

const BottomBar: React.FC<BottomBarProps> = ({ onSend }) => {
  const [message, setMessage] = React.useState('');
  const [isExpanded, setIsExpanded] = React.useState(false);
  const inputRef = useRef<HTMLTextAreaElement | null>(null); // ref 타입을 HTMLTextAreaElement로 수정

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
      inputRef.current?.focus(); // 메시지 전송 후 포커스 유지
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      if (event.shiftKey) {
        // Shift + Enter로 개행
        return; // 기본 동작을 방지하지 않음
      } else {
        event.preventDefault(); // 기본 Enter 키 동작 방지 (줄바꿈 방지)
        handleSend();
      }
    }
  };

  return (
    <Box className={`${styles.bottomBar} ${isExpanded ? styles.expanded : styles.collapsed}`}>
      <Box display="flex" alignItems="center" padding={1}>
        <Button
          variant="outlined"
          sx={{ marginRight: 1, marginBottom: 1, width: '40px', height: '40px', minWidth: '40px', whiteSpace: 'nowrap' }}
        >
          +
        </Button>
        <TextField
          variant="outlined"
          placeholder="채팅 입력"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          inputRef={inputRef} // ref 추가
          multiline // 다중 행 지원
          minRows={1} // 최소 행 수 설정
          maxRows={4} // 최대 행 수 설정
          sx={{ flex: 1, marginRight: 1, overflow: 'auto' }} // 오버플로우 처리
          inputProps={{
            onKeyDown: handleKeyDown, // KeyDown 이벤트 핸들러로 변경
          }}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ marginRight: 1, marginBottom: 1, width: '40px', height: '40px', minWidth: '50px', whiteSpace: 'nowrap' }}
          onClick={handleSend}
        >
          보내기
        </Button>
        <IconButton onClick={toggleExpand} sx={{ marginLeft: 1, marginBottom: 1 }}>
          {isExpanded ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
        </IconButton>
      </Box>

      {isExpanded && (
        <Box display="flex" marginTop={1} gap={1}>
          <Button variant="outlined" startIcon={<CameraIcon />}>
            캡처
          </Button>
          <Button variant="outlined" startIcon={<EmojiEmotionsIcon />}>
            스티커
          </Button>
          <Button variant="outlined" startIcon={<CardGiftcardIcon />}>
            선물
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default BottomBar;
