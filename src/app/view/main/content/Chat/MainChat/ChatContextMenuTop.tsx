// MessageMenu.tsx
import React from 'react';
import {Box, IconButton, Typography} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import styles from '../Styles/ChatMessageMenu.module.css';

interface ChatContextTopProps {
  id: number;
}

// 핸들러 함수 선언
const handleLike = () => {};
const handleDislike = () => {};

const ChatMessageMenuTop: React.FC<ChatContextTopProps> = ({id}) => {
  return (
    <Box>
      {/* 상단의 가로 메뉴 - Like와 Dislike 버튼 */}
      <Box className={styles.topMenuContainer}>
        {id}
        <IconButton onClick={handleLike} className={styles.iconButton}>
          <ThumbUpIcon />
          <Typography variant="body2">Like</Typography>
        </IconButton>
        <IconButton onClick={handleDislike} className={styles.iconButton}>
          <ThumbDownIcon />
          <Typography variant="body2">Dislike</Typography>
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatMessageMenuTop;
