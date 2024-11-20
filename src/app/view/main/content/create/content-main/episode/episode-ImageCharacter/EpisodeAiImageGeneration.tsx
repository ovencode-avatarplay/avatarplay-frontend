import React from 'react';
import {Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography} from '@mui/material';
import styles from './EpisodeAiImageGeneration.module.css'; // CSS 모듈 가져오기

interface EpisodeAiImageGenerationProps {
  open: boolean;
  onClose: () => void;
}

const EpisodeAiImageGeneration: React.FC<EpisodeAiImageGenerationProps> = ({open, onClose}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" className={styles.dialog}>
      <DialogTitle className={styles.dialogTitle}>AI Image Generation</DialogTitle>
      <DialogContent className={styles.dialogContent}>
        <Typography>여기에 AI Image Generation 모달 내용을 작성하세요.</Typography>
      </DialogContent>
      <DialogActions className={styles.dialogActions}>
        <Button onClick={onClose} className={styles.closeButton}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EpisodeAiImageGeneration;
