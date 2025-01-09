import React from 'react';
import {Box, Button, Typography, Modal} from '@mui/material';
import {Ruby} from '@ui/chatting';
import styles from './NotEnoughRubyPopup.module.css'; // CSS 모듈 경로

interface NotEnoughRubyPopupProps {
  open: boolean;
  onClose: () => void;
  rubyAmount: number; // 현재 루비 수량
}

const NotEnoughRubyPopup: React.FC<NotEnoughRubyPopupProps> = ({open, onClose, rubyAmount}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles.popupContainer}>
        <Typography variant="h6" className={styles.title}>
          Not enough Ruby
        </Typography>
        <div className={styles.rubyContainer}>
          <img src={Ruby.src} /> {rubyAmount}
        </div>
        <Typography variant="body2" className={styles.prompt}>
          Do you want to charge more Ruby?
        </Typography>
        <Box className={styles.buttonContainer}>
          <button className={styles.button} onClick={onClose}>
            No
          </button>
          <button
            className={styles.buttonYes}
            onClick={() => {
              onClose;
            }}
          >
            Yes
          </button>
        </Box>
      </Box>
    </Modal>
  );
};

export default NotEnoughRubyPopup;
