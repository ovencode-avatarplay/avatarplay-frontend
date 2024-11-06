import React from 'react';
import {Box, Button} from '@mui/material';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplayIcon from '@mui/icons-material/Replay';
import styles from '../Styles/ChatMessageMenu.module.css';

const handlePlayVoice = () => {};
const handleCopy = () => {};
const handleDelete = () => {};
const handleRegenerate = () => {};

const ChatMessageMenuBottom: React.FC = () => {
  return (
    <Box className={styles.bottomMenuContainer}>
      {/* 하단의 세로 메뉴 - 보이스 재생, 복사, 삭제, 재생성 버튼 */}
      <Button onClick={handlePlayVoice} className={styles.actionButton} startIcon={<PlayArrowIcon />}>
        Play Voice
      </Button>
      <Button onClick={handleCopy} className={styles.actionButton} startIcon={<ContentCopyIcon />}>
        Copy
      </Button>
      <Button onClick={handleDelete} className={styles.actionButton} startIcon={<DeleteIcon />}>
        Delete
      </Button>
      <Button onClick={handleRegenerate} className={styles.actionButton} startIcon={<ReplayIcon />}>
        Regenerate
      </Button>
    </Box>
  );
};

export default ChatMessageMenuBottom;
