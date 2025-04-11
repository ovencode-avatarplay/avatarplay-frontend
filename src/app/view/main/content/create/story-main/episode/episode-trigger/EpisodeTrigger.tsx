// 파일 경로: components/EpisodeTrigger.tsx

import React, {useEffect, useState} from 'react';
import styles from './EpisodeTrigger.module.css'; // CSS Module import
import {Dialog} from '@mui/material';
import WriteTriggerName from './WriteTriggerName'; // WriteTriggerName 모달 컴포넌트
import {EpisodeInfo} from '@/redux-store/slices/StoryInfo';
import {useDispatch, useSelector} from 'react-redux';
import {LineArrowLeft, LineTrigger} from '@ui/Icons';
import TriggerList from './TriggerList';
import TriggerCreate from './TriggerCreate';
import {RootState} from '@/redux-store/ReduxStore';
import TriggerChapterList from './TriggerChapterList';
import CustomButton from '@/components/layout/shared/CustomButton';

interface EpisodeTriggerProps {
  open: boolean; // 모달 열림 상태
  closeModal: () => void; // closeModal prop 추가
  episodeInfo: EpisodeInfo;
  saveDraft: () => void;
}

const EpisodeTrigger: React.FC<EpisodeTriggerProps> = ({open, closeModal, episodeInfo, saveDraft}) => {
  const [isWriteTriggerNameOpen, setWriteTriggerNameOpen] = useState(false); // WriteTriggerName 모달 상태
  const [isSelectTriggerTypeOpen, setSelectTriggerTypeOpen] = useState(false); // SelectTriggerType 모달 상태
  const [triggerName, setTriggerName] = useState(''); // Trigger name 상태
  const [openTriggerCreate, SetOpenTriggerCreate] = useState(false); // Trigger name 상태
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedChapterIdx, setSelectedChapterIdx] = useState<number | null>(null);
  const [selectedEpisodeIdx, setSelectedEpisodeIdx] = useState<number | null>(null);

  const editingStoryInfo = useSelector((state: RootState) => state.story.curEditingStoryInfo); // 현재 수정중인 컨텐츠 정보
  const handleConfirm = (chapterIdx: number, episodeIdx: number) => {
    setSelectedChapterIdx(chapterIdx);
    setSelectedEpisodeIdx(episodeIdx);
    setModalOpen(false); // 모달 닫기
  };
  const dispatch = useDispatch();

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
      disableEnforceFocus={true}
    >
      <div className={styles.modal_body}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.backButton} onClick={closeModal}>
              <img src={LineArrowLeft.src} className={styles.backIcon} />
            </button>
            <div className={styles.navTitle}>Trigger Event</div>
          </div>
        </div>

        <div className={styles.topGroup}>
          <div className={styles.episodeBar} onClick={() => setModalOpen(true)}>
            {episodeInfo.name ? episodeInfo.name : 'None'} <img src={LineTrigger.src} />
          </div>
          <div className={styles.counterAndCreate}>
            <div className={styles.counterButton}> {episodeInfo.triggerInfoList.length} / 10 </div>
            <div
              className={styles.createButton}
              onClick={() => {
                if (episodeInfo.triggerInfoList.length == 10) {
                  alert('10개 이상 만들 수 없습니다.');
                  return;
                }
                SetOpenTriggerCreate(true);
              }}
            >
              Create
            </div>
          </div>
          <div className={styles.triggerBox}>
            <TriggerList /> {/* CheckboxList 컴포넌트 추가 */}
            <div style={{height: '50px'}}></div>
          </div>
        </div>
        <div className={styles.buttonArea}>
          <CustomButton
            size="Large"
            state="Normal"
            type="Primary"
            customClassName={[styles.setupButtons]}
            onClick={() => {
              saveDraft();
              closeModal();
            }}
          >
            Apply
          </CustomButton>
        </div>
        {/* WriteTriggerName 모달 */}
        <WriteTriggerName
          open={isWriteTriggerNameOpen}
          onClose={handleCloseWriteTriggerName}
          onSave={handleSaveTriggerName} // Save 시 name 저장 및 다음 모달 열기
        />
        <TriggerCreate
          open={openTriggerCreate}
          onClose={() => {
            SetOpenTriggerCreate(false);
          }}
          isEditing={false}
        ></TriggerCreate>
        <TriggerChapterList
          open={isModalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleConfirm} // 콜백 전달
        />
      </div>
    </Dialog>
  );
};

export default EpisodeTrigger;
