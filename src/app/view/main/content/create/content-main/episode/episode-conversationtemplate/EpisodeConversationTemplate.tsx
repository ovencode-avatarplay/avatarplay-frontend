import React from 'react';
import styles from './EpisodeConversationTemplate.module.css'; // CSS Module import
import {Dialog, DialogTitle, Button} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CardSlider from './CardSlider'; // 카드 슬라이더 import

interface EpisodeConversationTemplateProps {
  open: boolean; // 모달 열림 상태
  closeModal: () => void; // 모달 닫기 함수
  triggerId?: number; // 트리거 ID (optional)
}

const EpisodeConversationTemplate: React.FC<EpisodeConversationTemplateProps> = ({
  open,
  closeModal,
  triggerId = -1, // 기본값은 -1
}) => {
  return (
    <Dialog
      closeAfterTransition={false}
      open={open}
      onClose={closeModal}
      fullScreen
      classes={{paper: styles['modal-body']}}
      disableAutoFocus={true}
      disableEnforceFocus={true} // disableEnforceFocus 속성 사용
    >
      <DialogTitle className={styles['modal-header']}>
        <Button onClick={closeModal} className={styles['close-button']}>
          <ArrowBackIosIcon />
        </Button>
        <span className={styles['modal-title']}>Episode Conversation Template</span>
      </DialogTitle>

      {/* CardSlider에 triggerId 전달 */}
      <CardSlider triggerId={triggerId} />
    </Dialog>
  );
};

export default EpisodeConversationTemplate;
