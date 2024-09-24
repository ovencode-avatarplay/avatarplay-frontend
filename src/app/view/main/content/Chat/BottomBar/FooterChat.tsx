import React from 'react';
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

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <Box className={`${styles.bottomBar} ${isExpanded ? styles.expanded : styles.collapsed}`}>
      <Box display="flex" alignItems="center" padding={1}>
            <Button variant="outlined" sx={{  marginRight: 1, marginBottom: 1 , width: '40px',
            height: '40px',
            minWidth: '40px', // 최소 너비를 20px로 설정
            whiteSpace: 'nowrap', // 텍스트 줄바꿈 방지
            //padding: '5' // 패딩을 0으로 설정
            }}>+</Button>
        <TextField
          variant="outlined"
          placeholder="채팅 입력"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          sx={{
             flex: 1,
             marginRight: 1,
             //minHeight: '20px',
             //marginBottom: 2
               }}
        />
        <Button variant="contained" color="primary" sx={{ marginRight: 1, marginBottom: 1, 
        width: '40px',
        height: '40px',
        minWidth: '50px', // 최소 너비를 20px로 설정
        whiteSpace: 'nowrap', // 텍스트 줄바꿈 방지
        //padding: '0' // 패딩을 0으로 설정
        }} onClick={handleSend}>
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
