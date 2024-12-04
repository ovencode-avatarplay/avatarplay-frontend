import React, {useState} from 'react';
import styles from './EpisodeStarringCharacter.module.css'; // CSS Module import
import {Dialog, DialogTitle, Button} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import EpisodeCharacter from './EpisodeCharacter';
import {TriggerInfo} from '@/types/apps/content/episode/TriggerInfo';

interface EpisodeStarringCharacterProps {
  open: boolean; // 모달 열림 상태
  closeModal: () => void; // 모달 닫기 함수
  isTrigger?: boolean;
  setTriggerInfo?: React.Dispatch<React.SetStateAction<TriggerInfo>>;
}

const EpisodeStarringCharacter: React.FC<EpisodeStarringCharacterProps> = ({
  open,
  closeModal,
  isTrigger,
  setTriggerInfo,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1); // 현재 스텝 관리
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prevStep => prevStep - 1);
    } else {
      closeModal(); // 첫 번째 스텝에서는 모달을 닫음
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
        <Button onClick={handleBack} className={styles['close-button']}>
          <ArrowBackIosIcon />
        </Button>
        <span className={styles['modal-title']}>Episode Conversation Template</span>
      </DialogTitle>
      <div style={{height: '90%'}}>
        <EpisodeCharacter
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          onClose={closeModal}
          isTrigger={isTrigger}
          setTriggerInfo={setTriggerInfo}
        />
      </div>

      {/* <Box className={styles.artistInfo}>
        <FormatListBulletedIcon fontSize="large" />

        <Box display="flex" flexDirection="column" className={styles.artistDetails}>
          <Typography variant="subtitle1">asd</Typography>
          <Typography variant="h6">asd</Typography>
        </Box>

        <IconButton onClick={() => {}} className={styles.arrowButton}>
          <ChevronRightIcon fontSize="large" />
        </IconButton>
      </Box> */}
    </Dialog>
  );
};

export default EpisodeStarringCharacter;
