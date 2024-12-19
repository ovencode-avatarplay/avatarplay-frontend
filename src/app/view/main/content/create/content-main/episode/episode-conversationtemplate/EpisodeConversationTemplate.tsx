import React, {useEffect} from 'react';
import styles from './EpisodeConversationTemplate.module.css'; // CSS Module import
import {Dialog, DialogTitle, Button, IconButton} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CardSlider from './CardSlider'; // 카드 슬라이더 import
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import {useDispatch} from 'react-redux'; // Redux useDispatch import
import {
  removeAllConversationTalk,
  removeAllActionConversationTalk,
  EpisodeInfo,
  setCurrentEpisodeInfo,
} from '@/redux-store/slices/EpisodeInfo';

interface EpisodeConversationTemplateProps {
  open: boolean; // 모달 열림 상태
  closeModal: () => void; // 모달 닫기 함수
  triggerIndex?: number; // 트리거 ID (optional)
  episodeInfo?: EpisodeInfo;
}

const EpisodeConversationTemplate: React.FC<EpisodeConversationTemplateProps> = ({
  open,
  closeModal,
  triggerIndex: triggerIndex = -1, // 기본값은 -1
  episodeInfo,
}) => {
  const dispatch = useDispatch(); // Redux dispatch hook 사용
  useEffect(() => {
    if (open && episodeInfo) {
      dispatch(setCurrentEpisodeInfo(episodeInfo));
    }
  }, [episodeInfo]);

  const handleResetConversations = () => {
    if (triggerIndex !== -1) {
      dispatch(removeAllActionConversationTalk({triggerIndex}));
    } else {
      dispatch(removeAllConversationTalk());
    }
  };

  return (
    <Dialog
      closeAfterTransition={false}
      open={open}
      onClose={closeModal}
      fullScreen
      className={styles['modal-body']}
      disableAutoFocus={true}
      disableEnforceFocus={true} // disableEnforceFocus 속성 사용
    >
      <DialogTitle className={styles['modal-header']}>
        <Button onClick={closeModal} className={styles['close-button']}>
          <ArrowBackIosIcon />
        </Button>
        <span className={styles['modal-title']}>Episode Conversation Template</span>

        {/* 리셋 버튼 클릭 시 전체 대화 제거 및 트리거별 대화 제거 */}
        <IconButton onClick={handleResetConversations}>
          <RestartAltIcon />
        </IconButton>
      </DialogTitle>

      {/* CardSlider에 triggerId 전달 */}
      <CardSlider Index={triggerIndex} />
    </Dialog>
  );
};

export default EpisodeConversationTemplate;
