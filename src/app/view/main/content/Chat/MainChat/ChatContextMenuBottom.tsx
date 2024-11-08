import React, {useState} from 'react';
import {Box, Button, Snackbar} from '@mui/material';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplayIcon from '@mui/icons-material/Replay';
import styles from '../Styles/ChatMessageMenu.module.css';

interface ChatContextTopProps {
  text: string;
}

const ChatMessageMenuBottom: React.FC<ChatContextTopProps> = ({text}) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handlePlayVoice = () => {};
  const handleCopy = (text: string, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setSnackbarMessage('Copied!');
        setSnackbarOpen(true);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };
  const handleDelete = () => {};
  const handleRegenerate = () => {};

  const handleSnackbarClose = () => {
    setSnackbarOpen(false); // Snackbar 닫기
  };

  return (
    <Box className={styles.bottomMenuContainer}>
      {/* 하단의 세로 메뉴 - 보이스 재생, 복사, 삭제, 재생성 버튼 */}
      <Button onClick={handlePlayVoice} className={styles.actionButton} startIcon={<PlayArrowIcon />}>
        Play Voice
      </Button>
      <Button onClick={e => handleCopy(text, e)} className={styles.actionButton} startIcon={<ContentCopyIcon />}>
        Copy
      </Button>
      <Button onClick={handleDelete} className={styles.actionButton} startIcon={<DeleteIcon />}>
        Delete
      </Button>
      <Button onClick={handleRegenerate} className={styles.actionButton} startIcon={<ReplayIcon />}>
        Regenerate
      </Button>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000} // 2초 후 자동 닫힘
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{vertical: 'bottom', horizontal: 'left'}} // 왼쪽 하단에 표시
        sx={{width: '20vw'}}
      />
    </Box>
  );
};

export default ChatMessageMenuBottom;
