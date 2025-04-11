import React, {useState} from 'react';
import {Box, IconButton} from '@mui/material';
import styles from '../Styles/ChatMessageMenu.module.css';
import {LikeOn, LikeOff} from '@ui/chatting';

interface ChatContextTopProps {
  id: number;
  index: number;
  isLike: boolean;
  onClickLike: (id: number, index: number, like: boolean) => void;
  closeAction: () => void;
}

const ChatMessageMenuTop: React.FC<ChatContextTopProps> = ({id, index, isLike, onClickLike, closeAction}) => {
  const [isLiked, setIsLiked] = useState(isLike);

  const handleLikeToggle = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    let prevData = isLiked;
    setIsLiked(!prevData);
    onClickLike(id, index, !prevData);
    setTimeout(() => {
      closeAction();
    }, 300);
  };

  return (
    <Box className={styles.topMenuContainer}>
      <IconButton onClick={handleLikeToggle} className={styles.iconButton}>
        <img className={styles.icon} src={isLiked ? LikeOn.src : LikeOff.src} alt={isLiked ? 'Liked' : 'Not Liked'} />
      </IconButton>
    </Box>
  );
};

export default ChatMessageMenuTop;
