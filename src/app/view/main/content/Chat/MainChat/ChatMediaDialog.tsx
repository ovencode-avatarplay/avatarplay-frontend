import React from 'react';
import {Box, IconButton, Modal} from '@mui/material';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {Pagination, Navigation} from 'swiper/modules';
import {MediaData, TriggerMediaState} from './ChatTypes'; // 필요한 타입을 임포트
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import styles from './ChatMediaDialog.module.css'; // CSS Module import
import ReactPlayer from 'react-player';

interface ChatMediaDialogProps {
  mediaData: MediaData | null;
  isModalOpen: boolean;
  closeModal: () => void;
  type: TriggerMediaState;
  initNum?: number | null;
}

const ChatMediaDialog: React.FC<ChatMediaDialogProps> = ({mediaData, isModalOpen, closeModal, type, initNum}) => {
  console.log('type', type);
  return (
    <Modal open={isModalOpen} onClose={closeModal}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 'var(--full-width)',
          height: '100vh',
          bgcolor: 'gray',
          zIndex: 1300,
          outline: 'none',
        }}
      >
        <Box className={styles['modal-header']}>
          <IconButton onClick={closeModal} className={styles['close-button']}>
            <ArrowBackIcon style={{fontSize: 32, color: 'white'}} />
          </IconButton>
          <span className={styles['modal-title']}>media</span>
        </Box>

        {type === TriggerMediaState.TriggerImage && (
          <Swiper
            style={{
              height: '90%',
            }}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            modules={[Pagination, Navigation]}
            className={styles.mySwiper}
            initialSlide={initNum || 0}
          >
            {mediaData?.mediaUrlList.map((url, idx) => (
              <SwiperSlide key={idx}>
                <img
                  src={url}
                  alt={`Slide ${idx}`}
                  loading="lazy"
                  style={{width: '100%', height: '100%', objectFit: 'contain'}}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        {type === TriggerMediaState.TriggerVideo && (
          <ReactPlayer
            muted={true}
            url={mediaData?.mediaUrlList[0]} // 첫 번째 URL 사용
            playing={true}
            controls={true}
            width="100%" // 비율 유지하며 높이 자동 조정
            height="90%" // 비율 유지하며 높이 자동 조정
            style={{
              borderRadius: '8px',
            }}
          />
        )}
      </Box>
    </Modal>
  );
};

export default ChatMediaDialog;
