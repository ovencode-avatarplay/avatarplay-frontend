import {Box, Button, Typography} from '@mui/material';
import {useEffect, useState} from 'react';

import styles from './ChatFloatingArea.module.css';
import {Play2} from '@ui/chatting';

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
    <Box className={`${styles.ChatFloatingArea}  ${isVisible ? styles.visible : ''}`}>
      <Typography className={styles.episodeName}>{episodeName}</Typography>
      <button className={styles.moveButton} onClick={onNavigate}>
        <img src={Play2.src} />
      </button>
    </Box>
  );
};

export default ChatFloatingArea;
