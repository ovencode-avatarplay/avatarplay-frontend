import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';

// Css, MUI
import {Drawer} from '@mui/material';

import styles from './ChapterBoard.module.css';
import {LinePlus} from '@ui/Icons';

// Slice
import {setSelectedChapterIdx, setSelectedEpisodeIdx} from '@/redux-store/slices/ContentSelection';

// Components
import ChapterItem from './ChapterItem';
import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';

// Types
import {ChapterInfo} from '@/redux-store/slices/ContentInfo';
import {EpisodeInfo} from '@/redux-store/slices/EpisodeInfo';
import {setCurrentEpisodeInfo} from '@/redux-store/slices/EpisodeInfo';

// Data
import emptyData from '@/data/create/empty-content-info-data.json';
import {Chapter} from './ChapterTypes';
import ConfirmationDialog from '@/components/layout/shared/ConfirmationDialog';

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

  const [chapters, setChapters] = useState<Chapter[]>([]);

  const selectedChapterIdx = useSelector((state: RootState) => state.contentselection.selectedChapterIdx);
  const selectedEpisodeIdx = useSelector((state: RootState) => state.contentselection.selectedEpisodeIdx);
  const editingContentInfo = useSelector((state: RootState) => state.content.curEditingContentInfo);

  // 삭제 Dialog
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    content: '',
    onConfirm: onClose,
  });

  //#region 함수

  // ChapterInfo를 Chapter로 변환하는 함수
  const transformChapterInfoToChapter = (chapterInfoList: ChapterInfo[]): Chapter[] => {
    return chapterInfoList.map(chapterInfo => ({
      id: chapterInfo.id,
      title: chapterInfo.name,
      episodes: chapterInfo.episodeInfoList.map(episodeInfo => ({
        id: episodeInfo.id,
        title: episodeInfo.name,
        thumbnail: episodeInfo.backgroundImageUrl,
        description: episodeInfo.episodeDescription,
        triggerInfoList: episodeInfo.triggerInfoList,
        conversationTemplateList: episodeInfo.conversationTemplateList,
      })),
      expanded: false,
    }));
  };

  const getMinEpisodeId = (chapters: Chapter[]): number | null => {
    const episodeIds = chapters.flatMap(chapter => chapter.episodes.map(episode => episode.id));

    if (episodeIds.length === 0) {
      return null; // 에피소드가 없는 경우 null 반환 (버그)
    }

    const minId = Math.min(...episodeIds);
    return minId > 0 ? 0 : minId;
  };

  const getMinChapterId = (chapters: Chapter[]): number | null => {
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
    setChapters(transformChapterInfoToChapter(contentChapters));
  }, [contentChapters]);

  useEffect(() => {
    if (open) {
      if (
        editingContentInfo.chapterInfoList[selectedChapterIdx] &&
        editingContentInfo.chapterInfoList[selectedChapterIdx].episodeInfoList[selectedEpisodeIdx]
      ) {
        dispatch(
          setCurrentEpisodeInfo(
            editingContentInfo.chapterInfoList[selectedChapterIdx].episodeInfoList[selectedEpisodeIdx],
          ),
        );
      } else {
        dispatch(setCurrentEpisodeInfo(editingContentInfo.chapterInfoList[0].episodeInfoList[0]));
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
      const newChapter: ChapterInfo = {
        id: newChapterId - 1,
        name: `New Chapter ${newChapterId - 1}`,
        episodeInfoList: [newEpisode], // 기본 에피소드 추가
      };

      onAddChapter(newChapter);
    }
  };

  const handleDeleteChapter = (chapterIdx: number) => {
    setConfirmDialog({
      open: true,
      title: 'Discard Chapter',
      content: `"${chapters[chapterIdx].title}" 챕터를 삭제하시겠습니까?`,
      onConfirm: () => {
        onDeleteChapter(chapterIdx);
        setChapters(prev => prev.filter((_, idx) => idx !== chapterIdx));
      },
    });
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

  const handleDeleteChapterOpen = () => {};
  //#endregion

  return (
    <>
      <Drawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {width: '100vw', height: '100vh', maxWidth: '402px', margin: '0 auto'},
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
        <div className={styles.drawerContainer}>
          {/* Chapter 및 Episode 트리 구조 */}
          <div className={styles.contentBox}>
            {chapters.map((chapter, index) => (
              <ChapterItem
                key={index}
                onCloseChapterBoard={onClose}
                chapter={chapter}
                chapterIdx={index}
                chapterLength={chapters.length}
                onDelete={handleDeleteChapter}
                onSelect={handleChapterSelect}
                onSelectEpisode={handleEpisodeSelect}
                onRename={handleRenameClick}
                isSelected={selectedChapterIdx === index}
                selectedEpisodeIdx={selectedEpisodeIdx}
                disableDelete={chapters.length <= 1}
              />
            ))}
          </div>
        </div>
        <div className={styles.confirmButtonBox}>
          <button className={styles.confirmButton} onClick={onClose}>
            Confirm
          </button>
        </div>
      </Drawer>

      <ConfirmationDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        content={confirmDialog.content}
        onClose={() => setConfirmDialog({...confirmDialog, open: false})}
        onConfirm={() => {
          confirmDialog.onConfirm();
          setConfirmDialog({...confirmDialog, open: false});
        }}
      />
    </>
  );
};

export default ChapterBoard;
