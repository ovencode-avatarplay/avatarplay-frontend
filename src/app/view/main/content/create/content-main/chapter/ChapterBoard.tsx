import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';

// Css, MUI
import {Drawer} from '@mui/material';

import styles from './ChapterBoard.module.css';
import {LinePlus} from '@ui/Icons';

// Slice
import {setSelectedChapterIdx, setSelectedEpisodeIdx, ChapterInfo, EpisodeInfo} from '@/redux-store/slices/ContentInfo';

// Components
import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';

// Data
import emptyData from '@/data/create/empty-content-info-data.json';
import ChapterList from './ChapterItemList';
import CustomPopup from '@/components/layout/shared/CustomPopup';
import CustomButton from '@/components/layout/shared/CustomButton';

interface Props {
  open: boolean;
  onClose: () => void;
  contentChapters: ChapterInfo[];
  onAddChapter: (newChapter: ChapterInfo) => void;
  onDeleteChapter: (chapterId: number) => void;
  onRenameClick: () => void;
  openInitEpisode: () => void;
  chapterFirstEpisode: EpisodeInfo;
}

const ChapterBoard: React.FC<Props> = ({
  open,
  onClose,
  contentChapters,
  onAddChapter,
  onDeleteChapter,
  onRenameClick,
  openInitEpisode,
  chapterFirstEpisode,
}) => {
  const dispatch = useDispatch();

  const [chapters, setChapters] = useState<ChapterInfo[]>([]);

  const selectedChapterIdx = useSelector((state: RootState) => state.content.selectedChapterIdx);
  const selectedEpisodeIdx = useSelector((state: RootState) => state.content.selectedEpisodeIdx);
  const editingContentInfo = useSelector((state: RootState) => state.content.curEditingContentInfo);

  // 삭제 Dialog
  const [confirmDialog, setConfirmDialog] = useState(false);

  //#region 함수

  const getMinEpisodeId = (chapters: ChapterInfo[]): number | null => {
    const episodeIds = chapters.flatMap(chapter => chapter.episodeInfoList.map(episode => episode.id));

    if (episodeIds.length === 0) {
      return null; // 에피소드가 없는 경우 null 반환 (버그)
    }

    const minId = Math.min(...episodeIds);
    return minId > 0 ? 0 : minId;
  };

  const getMinChapterId = (chapters: ChapterInfo[]): number | null => {
    if (chapters.length === 0) {
      return null; // Chapter가 없을 경우 null 반환 (버그)
    }

    const minChapterId = chapters.reduce((minId, chapter) => Math.min(minId, chapter.id), Infinity);

    return minChapterId > 0 ? 0 : minChapterId;
  };
  //#endregion

  //#region Hooks
  // ChapterInfo 배열을 컴포넌트 상태로 변환
  useEffect(() => {
    setChapters(contentChapters);
  }, [contentChapters]);

  useEffect(() => {
    if (open) {
      if (
        editingContentInfo.chapterInfoList[selectedChapterIdx] &&
        editingContentInfo.chapterInfoList[selectedChapterIdx].episodeInfoList[selectedEpisodeIdx]
      ) {
        // dispatch();
        // setCurrentEpisodeInfo(
        //   editingContentInfo.chapterInfoList[selectedChapterIdx].episodeInfoList[selectedEpisodeIdx],
        // ),
      } else {
        // dispatch(setCurrentEpisodeInfo(editingContentInfo.chapterInfoList[0].episodeInfoList[0]));
      }
    }
  }, [selectedChapterIdx, selectedEpisodeIdx]);

  useEffect(() => {
    if (
      chapterFirstEpisode !== null &&
      chapterFirstEpisode !== emptyData.data.contentInfo.chapterInfoList[0].episodeInfoList[0]
    ) {
      const tmp: EpisodeInfo = chapterFirstEpisode;
      handleCreateChapter(tmp);
    }
  }, [chapterFirstEpisode]);

  //#endregion

  //#region Handler
  //#region Chapter

  const handleChapterSelect = (chapterIdx: number) => {
    dispatch(setSelectedChapterIdx(chapterIdx));
    dispatch(setSelectedEpisodeIdx(0));
  };

  const handleCreateChapter = (newEpisode: EpisodeInfo) => {
    const newChapterId = getMinChapterId(chapters);
    const newEpisodeId = getMinEpisodeId(chapters);

    if (newChapterId != null && newEpisodeId != null) {
      newEpisode.id = newEpisodeId - 1;
      const newChapter: ChapterInfo = {
        id: newChapterId - 1,
        // name: `New Chapter ${newChapterId - 1}`,
        name: `New Chapter ${chapters.length + 1}`,
        episodeInfoList: [newEpisode], // 기본 에피소드 추가
      };

      onAddChapter(newChapter);
    }
  };

  const handleDuplicateChapter = () => {
    if (selectedChapterIdx < 0 || selectedChapterIdx >= editingContentInfo.chapterInfoList.length) {
      console.error('Invalid chapter index.');
      return;
    }

    const selectedChapter = editingContentInfo.chapterInfoList[selectedChapterIdx];
    const newChapterId = getMinChapterId(editingContentInfo.chapterInfoList);
    const newEpisodeId = getMinEpisodeId(editingContentInfo.chapterInfoList);

    if (newChapterId != null && newEpisodeId != null) {
      const duplicatedEpisodes = selectedChapter.episodeInfoList.map((episode, index) => ({
        ...episode,
        id: newEpisodeId - index - 1, // 새로운 에피소드 ID 부여
      }));

      // 새로운 챕터 생성
      const newChapter: ChapterInfo = {
        ...selectedChapter,
        id: newChapterId - 1, // 새로운 챕터 ID 부여
        name: `${selectedChapter.name} (Copy)`, // 복사본임을 알리는 이름
        episodeInfoList: duplicatedEpisodes,
      };

      // 추가 로직 실행
      onAddChapter(newChapter);
    }
  };

  const handleDeleteChapter = (chapterIdx: number) => {
    onDeleteChapter(chapterIdx);
    setChapters(prev => prev.filter((_, idx) => idx !== chapterIdx));
  };
  //#endregion

  //#region Episode

  const handleEpisodeSelect = (chapterIdx: number, episodeIdx: number) => {
    dispatch(setSelectedChapterIdx(chapterIdx));
    dispatch(setSelectedEpisodeIdx(episodeIdx));
    console.log(chapterIdx + '/' + episodeIdx);
  };
  //#endregion

  // Rename 팝업 열기
  const handleRenameClick = () => {
    onRenameClick();
  };

  //#endregion

  return (
    <>
      <Drawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {width: 'var(--full-width)', height: '100vh', margin: '0 auto'},
        }}
      >
        {/* Drawer Header */}
        <CreateDrawerHeader title="Season" onClose={onClose} />
        {/* Create Chapter 버튼 */}
        <button className={styles.addButton} onClick={openInitEpisode}>
          <div className={styles.buttonIconBox}>
            <img className={styles.buttonIcon} src={LinePlus.src} />
          </div>
          <div className={styles.buttonText}>Add new</div>
        </button>
        <ChapterList
          canEdit={true}
          chapters={chapters}
          selectedChapterIdx={selectedChapterIdx}
          selectedEpisodeIdx={selectedEpisodeIdx}
          onClose={onClose}
          onDelete={() => setConfirmDialog(true)}
          onSelect={handleChapterSelect}
          onSelectEpisode={handleEpisodeSelect}
          hideSelectedEpisode={true}
          onRename={handleRenameClick}
          onDuplicate={handleDuplicateChapter}
        />

        <div className={styles.confirmButtonBox}>
          <CustomButton
            size="Large"
            state="Normal"
            type="Primary"
            customClassName={[styles.confirmButton]}
            onClick={onClose}
          >
            Confirm
          </CustomButton>
        </div>
      </Drawer>
      {confirmDialog && (
        <CustomPopup
          type="alert"
          title="Discard Content?"
          description="Data will be disappeared. Are you sure?"
          buttons={[
            {
              label: 'Cancel',
              onClick: () => setConfirmDialog(false),
              isPrimary: false,
            },
            {
              label: 'Okay',
              onClick: () => {
                handleDeleteChapter(selectedChapterIdx);
                setConfirmDialog(false);
              },
              isPrimary: true,
            },
          ]}
        />
      )}
    </>
  );
};

export default ChapterBoard;
