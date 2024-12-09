// MessageMenu.tsx
import React from 'react';
import {Box, IconButton, Typography} from '@mui/material';
import styles from '../Styles/ChatMessageMenu.module.css';
import {LikeOn} from '@ui/chatting';

interface ChatContextTopProps {
  id: number;
}

// 핸들러 함수 선언
const handleLike = () => {};
const handleDislike = () => {};

const ChatMessageMenuTop: React.FC<ChatContextTopProps> = ({id}) => {
  return (
    <Box className={styles.topMenuContainer}>
      <IconButton onClick={handleLike} className={styles.iconButton}>
        <img className={styles.icon} src={LikeOn.src} />
      </IconButton>
    </Box>
  );
};

export default ChatMessageMenuTop;
