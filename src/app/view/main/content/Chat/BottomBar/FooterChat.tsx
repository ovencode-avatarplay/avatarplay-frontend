import React, { useRef } from 'react'; // useRef 추가
import { Box, Button, TextField, IconButton } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CameraIcon from '@mui/icons-material/Camera';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import styles from '@chats/Styles/StyleChat.module.css'; // 스타일 임포트

interface BottomBarProps {
  onSend: (message: string) => void;
}

const BottomBar: React.FC<BottomBarProps> = ({ onSend }) => {
  const [message, setMessage] = React.useState('');
  const [isExpanded, setIsExpanded] = React.useState(false);
  const inputRef = useRef<HTMLDivElement | null>(null); // ref 추가

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

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // 기본 Enter 키 동작 방지 (줄바꿈 방지)
      handleSend();
    }
  };

  return (
    <Box className={`${styles.bottomBar} ${isExpanded ? styles.expanded : styles.collapsed}`}>
      <Box display="flex" alignItems="center" padding={1}>
        <Button variant="outlined" sx={{ marginRight: 1, marginBottom: 1, width: '40px', height: '40px', minWidth: '40px', whiteSpace: 'nowrap' }}>+</Button>
        <TextField
          variant="outlined"
          placeholder="채팅 입력"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress} // Enter 키 이벤트 핸들러 추가
          inputRef={inputRef} // ref 추가
          sx={{ flex: 1, marginRight: 1 }}
        />
        <Button variant="contained" color="primary" sx={{ marginRight: 1, marginBottom: 1, width: '40px', height: '40px', minWidth: '50px', whiteSpace: 'nowrap' }} onClick={handleSend}>
          보내기
        </Button>
        <IconButton onClick={toggleExpand} sx={{ marginLeft: 1, marginBottom: 1 }}>
          {isExpanded ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
        </IconButton>
      </Box>

      {isExpanded && (
        <Box display="flex" marginTop={1} gap={1}>
          <Button variant="outlined" startIcon={<CameraIcon />}>캡처</Button>
          <Button variant="outlined" startIcon={<EmojiEmotionsIcon />}>스티커</Button>
          <Button variant="outlined" startIcon={<CardGiftcardIcon />}>선물</Button>
        </Box>
      )}
    </Box>
  );
};

export default BottomBar;
