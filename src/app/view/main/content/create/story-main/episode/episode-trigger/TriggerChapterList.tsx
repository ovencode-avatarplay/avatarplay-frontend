import React, {useState} from 'react';
import styles from './TriggerChapterList.module.css'; // CSS Module import
import {Dialog, DialogTitle, DialogContent, DialogActions, Button} from '@mui/material';
import {BoldArrowLeft} from '@ui/Icons';
import ChapterItemList from '../../chapter/ChapterItemList';
import {useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';

interface TriggerChapterListProps {
  open: boolean; // 모달 열림 상태
  onClose: () => void; // 모달 닫기 핸들러
  onConfirm: (chapterIdx: number, episodeIdx: number) => void; // Confirm 콜백 추가
}

const TriggerChapterList: React.FC<TriggerChapterListProps> = ({open, onClose, onConfirm}) => {
  const editingStoryInfo = useSelector((state: RootState) => state.story.curEditingStoryInfo); // 현재 수정중인 컨텐츠 정보
  const [targetChapterIdx, setTargetChapterIdx] = useState(0);
  const [targetEpisodeIdx, setTargetEpisodeIdx] = useState(0);
  const handleChapterSelect = (chapterIdx: number) => {
    setTargetChapterIdx(chapterIdx);
  };
  const handleEpisodeSelect = (chapterIdx: number, episodeIdx: number) => {
    console.log('asdas');
    setTargetEpisodeIdx(episodeIdx);
  };

  return (
    <Dialog
      closeAfterTransition={false}
      open={open}
      onClose={onClose}
      fullScreen
      className={styles['modal-body']}
      disableAutoFocus={true}
      disableEnforceFocus={true} // disableEnforceFocus 속성 사용
    >
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backButton} onClick={onClose}>
            <img src={BoldArrowLeft.src} className={styles.backIcon} />
          </button>
          <div className={styles.navTitle}>Trigger Event</div>
        </div>
      </div>

      <ChapterItemList
        canEdit={false}
        chapters={editingStoryInfo.chapterInfoList}
        selectedChapterIdx={targetChapterIdx}
        selectedEpisodeIdx={targetEpisodeIdx}
        onClose={onClose}
        onSelect={handleChapterSelect}
        onSelectEpisode={handleEpisodeSelect}
        hideSelectedEpisode={false}
        onDelete={() => {}}
        onRename={() => {}}
      />

      <div className={styles.contentBottom}>
        <div
          className={styles.setupButtons}
          onClick={() => {
            onConfirm(targetChapterIdx, targetEpisodeIdx);
          }}
        >
          Confirm
        </div>
      </div>
    </Dialog>
  );
};

export default TriggerChapterList;
