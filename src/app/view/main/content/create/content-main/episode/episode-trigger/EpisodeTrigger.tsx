// 파일 경로: components/EpisodeTrigger.tsx

import React, {useEffect, useState} from 'react';
import styles from './EpisodeTrigger.module.css'; // CSS Module import
import {Dialog, Button, Box, IconButton} from '@mui/material';
import CheckboxList from './TriggerList'; // CheckboxList 컴포넌트 임포트
import WriteTriggerName from './WriteTriggerName'; // WriteTriggerName 모달 컴포넌트
import SelectTriggerType from './SelectTriggerType';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {EpisodeInfo, setCurrentEpisodeInfo} from '@/redux-store/slices/EpisodeInfo';
import {useDispatch} from 'react-redux';
import {BoldArrowLeft, LineTrigger} from '@ui/Icons';
import TriggerList from './TriggerList';

interface EpisodeTriggerProps {
  open: boolean; // 모달 열림 상태
  closeModal: () => void; // closeModal prop 추가
  episodeInfo: EpisodeInfo;
}

const EpisodeTrigger: React.FC<EpisodeTriggerProps> = ({open, closeModal, episodeInfo}) => {
  const [isWriteTriggerNameOpen, setWriteTriggerNameOpen] = useState(false); // WriteTriggerName 모달 상태
  const [isSelectTriggerTypeOpen, setSelectTriggerTypeOpen] = useState(false); // SelectTriggerType 모달 상태
  const [triggerName, setTriggerName] = useState(''); // Trigger name 상태

  const dispatch = useDispatch();
  useEffect(() => {
    if (open) {
      dispatch(setCurrentEpisodeInfo(episodeInfo));
    }
  }, [episodeInfo]);
  // WriteTriggerName 모달 열기
  const handleOpenWriteTriggerName = () => {
    setWriteTriggerNameOpen(true);
  };

  // WriteTriggerName 모달 닫기
  const handleCloseWriteTriggerName = () => {
    setWriteTriggerNameOpen(false);
  };

  // SelectTriggerType 모달 열기
  const handleOpenSelectTriggerType = () => {
    setSelectTriggerTypeOpen(true);
  };

  // SelectTriggerType 모달 닫기
  const handleCloseSelectTriggerType = () => {
    setSelectTriggerTypeOpen(false);
  };

  // Save 버튼 클릭 시 처리 로직
  const handleSaveTriggerName = (name: string) => {
    setTriggerName(name); // 입력받은 name을 저장
    handleCloseWriteTriggerName(); // WriteTriggerName 모달 닫기
    handleOpenSelectTriggerType(); // SelectTriggerType 모달 열기
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
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backButton} onClick={closeModal}>
            <img src={BoldArrowLeft.src} className={styles.backIcon} />
          </button>
          <div className={styles.navTitle}>Trigger Event</div>
        </div>
      </div>

      <div className={styles.topGroup}>
        <div className={styles.episodeBar}>
          {episodeInfo.name ? episodeInfo.name : 'None'} <img src={LineTrigger.src} />
        </div>
        <div className={styles.counterAndCraete}>
          <div className={styles.counterButton}> {episodeInfo.triggerInfoList.length} / 10 </div>
          <div className={styles.createButton}>Create</div>
        </div>
        <div className={styles.triggerBox}>
          <TriggerList /> {/* CheckboxList 컴포넌트 추가 */}
          <div style={{height: '50px'}}></div>
        </div>
      </div>
      <div className={styles.contentBottom}>
        <div className={styles.setupButtons} onClick={() => {}}>
          Confirm
        </div>
      </div>
      {/* WriteTriggerName 모달 */}
      <WriteTriggerName
        open={isWriteTriggerNameOpen}
        onClose={handleCloseWriteTriggerName}
        onSave={handleSaveTriggerName} // Save 시 name 저장 및 다음 모달 열기
      />
      {/* SelectTriggerType 모달 */}
      <SelectTriggerType
        open={isSelectTriggerTypeOpen}
        onClose={handleCloseSelectTriggerType}
        triggerName={triggerName} // 전달된 name을 SelectTriggerType으로 전달
      />
    </Dialog>
  );
};

export default EpisodeTrigger;
