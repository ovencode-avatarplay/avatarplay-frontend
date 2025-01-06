// 파일 경로: components/EpisodeTrigger.tsx

import React, {useEffect, useState} from 'react';
import styles from './EpisodeTrigger.module.css'; // CSS Module import
import {Dialog, Button, Box, IconButton} from '@mui/material';
import WriteTriggerName from './WriteTriggerName'; // WriteTriggerName 모달 컴포넌트
import {EpisodeInfo, setCurrentEpisodeInfo} from '@/redux-store/slices/EpisodeInfo';
import {useDispatch, useSelector} from 'react-redux';
import {BoldArrowLeft, LineTrigger} from '@ui/Icons';
import TriggerList from './TriggerList';
import TriggerCreate from './TriggerCreate';
import {RootState} from '@/redux-store/ReduxStore';
import TriggerChapterList from './TriggerChapterList';

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

  const editingContentInfo = useSelector((state: RootState) => state.content.curEditingContentInfo); // 현재 수정중인 컨텐츠 정보
  const handleConfirm = (chapterIdx: number, episodeIdx: number) => {
    setSelectedChapterIdx(chapterIdx);
    setSelectedEpisodeIdx(episodeIdx);
    setModalOpen(false); // 모달 닫기
    dispatch(setCurrentEpisodeInfo(editingContentInfo.chapterInfoList[chapterIdx].episodeInfoList[episodeIdx]));
  };
  const dispatch = useDispatch();
  useEffect(() => {
    if (open) {
      dispatch(setCurrentEpisodeInfo(episodeInfo));
    }
  }, [open, episodeInfo, dispatch]);

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
      disableAutoFocus={true}
      disableEnforceFocus={true} // disableEnforceFocus 속성 사용
    >
      <div className={styles.modal_body}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.backButton} onClick={closeModal}>
              <img src={BoldArrowLeft.src} className={styles.backIcon} />
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
        <div className={styles.contentBottom}>
          <div
            className={styles.setupButtons}
            onClick={() => {
              saveDraft();
            }}
          >
            Apply
          </div>
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
