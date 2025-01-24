import React, {useState, useEffect, useRef} from 'react';
import {Box, IconButton, Modal} from '@mui/material';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {Pagination, Navigation} from 'swiper/modules';
import {MediaData, TriggerMediaState} from './ChatTypes';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import styles from './ChatMediaDialog.module.css';
import ReactPlayer from 'react-player';
import {LineArrowLeft} from '@ui/Icons';

interface ChatMediaDialogProps {
  mediaData: MediaData | null;
  isModalOpen: boolean;
  closeModal: () => void;
  type: TriggerMediaState;
  initNum?: number | null;
}

const ChatMediaDialog: React.FC<ChatMediaDialogProps> = ({mediaData, isModalOpen, closeModal, type, initNum}) => {
  const [isHeaderVisible, setHeaderVisible] = useState(true); // 헤더 가시성 상태
  const hideTimer = useRef<NodeJS.Timeout | null>(null); // 타이머를 관리하기 위한 ref

  // 헤더 숨김 처리 함수
  const resetHideTimer = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current); // 기존 타이머 초기화
    }
    hideTimer.current = setTimeout(() => {
      setHeaderVisible(false); // 3초 후 헤더 숨김
    }, 3000);
  };

  // 터치 또는 슬라이드 이벤트 처리 함수
  const handleMediaInteraction = () => {
    setHeaderVisible(true); // 헤더 보이기
    resetHideTimer(); // 타이머 초기화 및 재설정
  };

  // 슬라이드 변경 시 헤더 숨기기
  const handleSlideChange = () => {
    setHeaderVisible(false); // 헤더 숨기기
    resetHideTimer(); // 타이머 재설정
  };

  // Modal이 열릴 때 초기화
  useEffect(() => {
    if (isModalOpen) {
      setHeaderVisible(true); // 초기에는 헤더가 보임
      resetHideTimer(); // 타이머 설정
    } else if (hideTimer.current) {
      clearTimeout(hideTimer.current); // 모달이 닫히면 타이머 해제
    }
  }, [isModalOpen]);

  return (
    <Modal
      open={isModalOpen}
      onClose={closeModal}
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.8)', // 검은색 배경 (투명도 80%)
        },
      }}
    >
      <Box
        sx={{
          position: 'fixed',
          width: 'var(--full-width)',
          height: '100vh',
          bgcolor: 'gray',
          zIndex: 1300,
          outline: 'none',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.8)', // 검은색 배경 (투명도 80%)
        }}
        onClick={handleMediaInteraction} // 터치 이벤트 핸들러
      >
        {/* 헤더 */}
        <Box
          className={styles['modal-header']}
          style={{
            transform: isHeaderVisible ? 'translateY(0)' : 'translateY(-100%)',
            transition: 'transform 0.3s ease-in-out',
          }}
        >
          <IconButton onClick={closeModal} className={styles['close-button']}>
            <img src={LineArrowLeft.src}></img>
          </IconButton>
        </Box>

        {/* 이미지 슬라이드 */}
        {type === TriggerMediaState.TriggerImage && (
          <Swiper
            style={{
              height: '90%',
            }}
            modules={[Pagination, Navigation]}
            className={styles.mySwiper}
            initialSlide={initNum || 0}
            onSlideChange={handleSlideChange} // 슬라이드 변경 이벤트 핸들러
          >
            {mediaData?.mediaUrlList.map((url, idx) => (
              <SwiperSlide key={idx}>
                <img
                  src={url}
                  alt={`Slide ${idx}`}
                  loading="lazy"
                  style={{width: '100%', height: '100%', objectFit: 'contain'}}
                  onClick={handleMediaInteraction} // 이미지 클릭 이벤트
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        {/* 동영상 */}
        {type === TriggerMediaState.TriggerVideo && (
          <ReactPlayer
            muted={true}
            url={mediaData?.mediaUrlList[0]} // 첫 번째 URL 사용
            playing={true}
            controls={true}
            width="100%"
            height="90%"
            style={{
              borderRadius: '8px',
            }}
            onClick={handleMediaInteraction} // 동영상 클릭 이벤트
          />
        )}
      </Box>
    </Modal>
  );
};

export default ChatMediaDialog;
