import React from 'react';
import {Box, Button, Typography, Modal} from '@mui/material';
import DiamondIcon from '@mui/icons-material/Diamond'; // 다이아몬드 아이콘 임포트
import styles from './NotEnoughRubyPopup.module.css'; // CSS 모듈 경로
import Image from 'next/image'; // 아이콘에 사용할 이미지

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
        <DiamondIcon style={{fontSize: 24}} />
        <Typography variant="body2" className={styles.prompt}>
          Do you want to charge more Ruby?
        </Typography>
        <Box className={styles.buttonContainer}>
          <Button variant="outlined" onClick={onClose}>
            No
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              /* 루비 충전 로직 */
            }}
          >
            Yes
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default NotEnoughRubyPopup;
