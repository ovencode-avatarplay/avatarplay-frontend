import React, {useEffect, useState} from 'react';
import {Box, Typography, Modal} from '@mui/material';
import styles from './NextEpisodePopup.module.css'; // CSS 모듈 경로
import ImageIcon from '@mui/icons-material/Image';
import {TriggerNextEpisodeInfo} from '@/app/NetWork/ChatNetwork';
import {DialogBody, NextEpisodeWait} from '@ui/chatting';

interface PopupProps {
  open: boolean;
  data?: TriggerNextEpisodeInfo;
  onYes: () => void;
  onNo: () => void;
}

const NextEpisodePopup: React.FC<PopupProps> = ({open, onYes, onNo, data}) => {
  const [waitTime, setWaitTime] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setWaitTime(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onYes();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 타이머 정리
  }, [onYes]);

  return (
    <Modal open={open} onClose={() => {}}>
      {data ? ( // data가 존재할 때만 내용을 렌더링
        <div className={styles.dialogBody}>
          <div className={styles.dialogContentAction}>
            <div className={styles.newEpisodeArea}>
              <Typography variant="h6" component="h2" className={styles.newEpisodeTitle}>
                New Episode opened!
              </Typography>
              <Box className={styles.newEpisodeList}>
                <div className={styles.transactionItemImage}>
                  <Box
                    className={styles.episodeCover}
                    style={{
                      backgroundImage: `url(${data.nextEpisodeBackgroundImageUrl || '/Images/001.png'})`,
                      backgroundSize: 'cover', // 이미지 비율을 유지하면서 박스 안에 맞춤
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat', // 이미지를 반복하지 않도록 설정
                      overflow: 'hidden', // 이미지를 영역을 벗어나지 않도록 설정
                    }}
                  >
                    <Box className={styles.imageCounter}>
                      <img src={DialogBody.src} className={styles.iconsViewImage} />
                      <Typography variant="body2" className={styles.iconViewText}>
                        {5}
                      </Typography>
                    </Box>
                  </Box>
                </div>
                <div className={styles.transactionItemText}>
                  <div className={styles.textArea}>
                    <div className={styles.textBody}>
                      <Typography className={styles.episodeTitle}>{data.nextEpisodeName}</Typography>
                      <Typography className={styles.episodeDesc}>{data.nextEpisodeDescription}</Typography>
                    </div>
                  </div>
                </div>
              </Box>
            </div>
          </div>

          <Typography variant="body2" className={styles.descArea}>
            Ready to jump into the next episode?
          </Typography>
          <Box className={styles.buttonArea}>
            <button className={`${styles.buttonDefault} ${styles.buttonBgNo}`} onClick={onNo}>
              <div className={styles.buttonTextNo}>No</div>
              <div className={styles.buttonTextNoSub}>(Continue Chatting)</div>
            </button>
            <button className={`${styles.buttonDefault} ${styles.buttonBgYes}`} onClick={onYes}>
              <div className={styles.buttonTextYes}>Yes</div>
              <div className={styles.loadingItem}>
                <img src={NextEpisodeWait.src} className={styles.rotatingImage} alt="Loading" />
                <div className={styles.waitTime}>{waitTime}</div>
              </div>
            </button>
          </Box>
        </div>
      ) : (
        <>
          <Typography className={styles.loadingText}>다음 에피소드 데이터를 불러오는데 실패했습니다.</Typography>{' '}
          {/*data가 없을 때 로딩 상태 표시 */}
          <button className={`${styles.buttonDefault} ${styles.buttonBgNo}`} onClick={onNo}>
            <div className={styles.buttonTextNo}>닫기</div>
          </button>
        </>
      )}
    </Modal>
  );
};

export default NextEpisodePopup;
