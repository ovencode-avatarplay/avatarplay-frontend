import React from 'react';
import {Button, Typography} from '@mui/material';
import styles from './StudioDashboardFooter.module.css';

interface FooterButton {
  icon: React.ReactNode; // MUI 아이콘
  text: string; // 버튼 텍스트
  onClick: () => void; // 실행할 함수
}

interface StudioDashboardFooterProps {
  buttons: FooterButton[]; // 버튼 배열
}

const StudioDashboardFooter: React.FC<StudioDashboardFooterProps> = ({buttons}) => {
  return (
    <div className={styles.footer}>
      {buttons.map((button, index) => (
        <Button key={index} className={styles.button} startIcon={button.icon} onClick={button.onClick}>
          <Typography>{button.text}</Typography>
        </Button>
      ))}
    </div>
  );
};

export default StudioDashboardFooter;
