import React from 'react';
import {Box, Button, Typography, Modal} from '@mui/material';
import styles from './NextEpisodePopup.module.css'; // CSS 모듈 경로
import {ChattingResultData} from '@/app/NetWork/ChatNetwork';
import {Padding} from '@mui/icons-material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ImageIcon from '@mui/icons-material/Image';

interface PopupProps {
  open: boolean;
  data?: ChattingResultData;
  onYes: () => void;
  onNo: () => void;
}

const NextEpisodePopup: React.FC<PopupProps> = ({open, onYes, onNo, data}) => {
  return (
    <Modal open={open} onClose={() => {}}>
      <Box className={styles.popupContainer}>
        {data ? ( // data가 존재할 때만 내용을 렌더링
          <>
            <Typography variant="h6" component="h2" className={styles.title}>
              New Episode opened!
            </Typography>
            <Box className={styles.boderBox}>
              <Box
                className={styles.content}
                style={{
                  backgroundImage: `url(${data.nextEpisodeThumbnail})`,
                  backgroundSize: 'contain', // 이미지 비율을 유지하면서 박스 안에 맞춤
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat', // 이미지를 반복하지 않도록 설정
                  width: '150px', // 고정 너비
                  height: '100px', // 고정 높이
                  borderRadius: '8px',
                  border: '2px solid black', // 검은색 테두리 추가
                  overflow: 'hidden', // 이미지를 영역을 벗어나지 않도록 설정
                }}
              >
                <Box className={styles.imageOverlay}>
                  <Box className={styles.iconInfo}>
                    <FavoriteIcon color="error" />
                    <Typography variant="body2" className={styles.iconText}>
                      {5}%
                    </Typography>
                  </Box>
                  <Box className={styles.iconInfo}>
                    <ImageIcon color="action" />
                    <Typography variant="body2" className={styles.iconText}>
                      {5}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box className={styles.textBox}>
                <Typography className={styles.nameText}>{data.nextEpisodeName}</Typography>
                <Typography className={styles.descText}>{data.nextEpisodeDescription}</Typography>
              </Box>
            </Box>
            <Typography variant="body2" className={styles.prompt}>
              Do you want to move to the next episode?
            </Typography>
            <Box className={styles.buttonContainer}>
              <Button variant="outlined" onClick={onNo}>
                No
              </Button>
              <Button variant="contained" color="primary" className={styles.yesButton} onClick={onYes}>
                Yes
              </Button>
            </Box>
          </>
        ) : (
          <Typography variant="body2">Loading...</Typography> // data가 없을 때 로딩 상태 표시
        )}
      </Box>
    </Modal>
  );
};

export default NextEpisodePopup;
