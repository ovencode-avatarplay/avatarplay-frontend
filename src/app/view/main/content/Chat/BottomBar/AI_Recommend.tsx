import React, {useState} from 'react';
import {Box, Typography, Button, Modal, TextField} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import styles from './AI_Recommend.module.css'; // CSS 모듈 파일 import

interface AIRecommendProps {
  open: boolean;
  onClose: () => void;
}

const AI_Recommend: React.FC<AIRecommendProps> = ({open, onClose}) => {
  const [message, setMessage] = useState<string>(''); // 상태로 메시지를 관리

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value); // 메시지 텍스트 변경
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles.modalContainer}>
        <Typography className={styles.modalTitle} component="h2">
          추천 채팅
        </Typography>

        <Box className={styles.messageBoxContainer}>
          {[1, 2, 3].map((_, index) => (
            <Box key={index} className={styles.messageBox}>
              <TextField
                variant="outlined"
                multiline
                rows={2} // 2줄만 보이도록 설정
                value={message} // 상태로 관리되는 메시지를 텍스트 필드에 표시
                onChange={handleMessageChange} // 텍스트 필드 내용 변경 시 상태 업데이트
                className={styles.messageText} // CSS 모듈 클래스 적용
                sx={{height: 'auto'}} // 추가로 높이를 자동으로 맞추기
              />
              <Button variant="outlined" startIcon={<EditIcon />}></Button>
            </Box>
          ))}
        </Box>
      </Box>
    </Modal>
  );
};

export default AI_Recommend;
