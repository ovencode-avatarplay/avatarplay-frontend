import {Box, Button, Typography} from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {useEffect, useState} from 'react';

import styles from './ChatFloatingArea.module.css';

interface ChatFloatingAreaProps {
  episodeName: string;
  onNavigate: () => void;
}

const ChatFloatingArea: React.FC<ChatFloatingAreaProps> = ({episodeName, onNavigate}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 컴포넌트 활성화 시 애니메이션 실행
    setIsVisible(true);
  }, []);

  return (
    <Box className={`${styles.ChatFloatingArea} ${isVisible ? styles.visible : ''}`}>
      <Typography className={styles.episodeName}>{episodeName}</Typography>
      <Button variant="contained" className={styles.moveButton} onClick={onNavigate}>
        {' '}
        <ArrowForwardIosIcon />
      </Button>
    </Box>
  );
};

export default ChatFloatingArea;
