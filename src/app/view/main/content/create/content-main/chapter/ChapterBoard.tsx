import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';

// Css, MUI
import {
  Drawer,
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

import styles from './ChapterBoard.module.css';

// Slice
import {setSelectedChapterIdx, setSelectedEpisodeIdx} from '@/redux-store/slices/ContentSelection';
import {updateEditingContentInfo} from '@/redux-store/slices/ContentInfo';

// Components
import ChapterItem from './ChapterItem';
import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';

// Types
import {ContentInfo, ChapterInfo} from '@/redux-store/slices/ContentInfo';
import {EpisodeInfo} from '@/redux-store/slices/EpisodeInfo';
import {setCurrentEpisodeInfo} from '@/redux-store/slices/EpisodeInfo';

// Data
import emptyData from '@/data/create/empty-content-info-data.json';
import {Chapter} from './ChapterTypes';
import ConfirmationDialog from '@/components/layout/shared/ConfirmationDialog';

interface Props {
  open: boolean;
  onClose: () => void;
  initialChapters: ChapterInfo[];
  onAddChapter: (newChapter: ChapterInfo) => void;
  onDeleteChapter: (chapterId: number) => void;
  onAddEpisode: (newEpisode: EpisodeInfo) => void;
  onDeleteEpisode: (chapterId: number, episodeId: number) => void;
  onNameChange: (contentInfo: ContentInfo) => void;
}

const ChapterBoard: React.FC<Props> = ({
  open,
  onClose,
  initialChapters,
  onAddChapter,
  onDeleteChapter,
  onAddEpisode,
  onDeleteEpisode,
  onNameChange,
}) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const selectedContent = useSelector((state: RootState) => state.content.curEditingContentInfo);

  const selectedChapterIdx = useSelector((state: RootState) => state.contentselection.selectedChapterIdx);
  const selectedEpisodeIdx = useSelector((state: RootState) => state.contentselection.selectedEpisodeIdx);
  const editingContentInfo = useSelector((state: RootState) => state.content.curEditingContentInfo);
  const [editItem, setEditItem] = useState<{idx: number | null; type: 'chapter' | 'episode' | null}>({
    idx: null,
    type: null,
  });
  const [newName, setNewName] = useState<string>('');
  const dispatch = useDispatch();

  // 삭제 Dialog
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    content: '',
    onConfirm: () => {},
  });

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

  // ChapterInfo 배열을 컴포넌트 상태로 변환
  useEffect(() => {
    setChapters(transformChapterInfoToChapter(initialChapters));
  }, [initialChapters]);

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

  const getMaxId = (items: {id: number}[]) => items.reduce((maxId, item) => Math.max(maxId, item.id), 0);

  //#region Chapter

  const handleChapterToggle = (chapterIdx: number) => {
    setChapters(prevChapters =>
      prevChapters.map((chapter, index) =>
        index === chapterIdx ? {...chapter, expanded: !chapter.expanded} : chapter,
      ),
    );
  };

  const handleChapterSelect = (chapterIdx: number) => {
    // const confirmation = window.confirm('다른 챕터 수정으로 이동하시겠습니까?');

    // if (confirmation) {
    dispatch(setSelectedChapterIdx(chapterIdx));
    dispatch(setSelectedEpisodeIdx(0));
    // }
  };

  const handleCreateChapter = () => {
    // const confirmation = window.confirm('챕터를 추가하고 새 챕터의 에피소드 수정으로 이동하시겠습니까?');

    // if (confirmation) {
    const newChapterId = getMinChapterId(chapters);
    const newEpisodeId = getMinEpisodeId(chapters);
    if (newChapterId != null && newEpisodeId != null) {
      const newEpisode: EpisodeInfo = {
        ...emptyData.data.contentInfo.chapterInfoList[0].episodeInfoList[0],
        id: newEpisodeId - 1,
        name: `New Episode ${newEpisodeId - 1}`,
      };

      const newChapter: ChapterInfo = {
        id: newChapterId - 1,
        name: `New Chapter ${newChapterId - 1}`,
        episodeInfoList: [newEpisode], // 기본 에피소드 추가
      };

      onAddChapter(newChapter);
    }
    // }
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
    // const confirmation = window.confirm('다른 에피소드 수정으로 이동하시겠습니까?');

    // if (confirmation) {
    dispatch(setSelectedChapterIdx(chapterIdx));
    dispatch(setSelectedEpisodeIdx(episodeIdx));
    // }
  };

  const handleChangeName = (idx: number, type: 'chapter' | 'episode', newName: string) => {
    setChapters(prevChapters =>
      prevChapters.map((chapter, chapterIdx) => {
        if (type === 'chapter' && chapterIdx === selectedChapterIdx) {
          const updatedContent = {
            ...selectedContent,
            chapterInfoList: selectedContent?.chapterInfoList.map((chapterInfo, index) =>
              index === chapterIdx ? {...chapterInfo, name: newName} : chapterInfo,
            ),
          };
          dispatch(updateEditingContentInfo(updatedContent));
          onNameChange(updatedContent);
          return {...chapter, title: newName};
        } else if (type === 'episode' && chapterIdx === selectedChapterIdx) {
          const updatedEpisodes = chapter.episodes.map((episode, episodeIdx) =>
            episodeIdx === selectedEpisodeIdx ? {...episode, title: newName} : episode,
          );

          const updatedContent = {
            ...selectedContent,
            chapterInfoList: selectedContent?.chapterInfoList.map((chapterInfo, index) =>
              index === selectedChapterIdx
                ? {
                    ...chapterInfo,
                    episodeInfoList: chapterInfo.episodeInfoList.map((episodeInfo, epIdx) =>
                      epIdx === selectedEpisodeIdx ? {...episodeInfo, name: newName} : episodeInfo,
                    ),
                  }
                : chapterInfo,
            ),
          };

          dispatch(updateEditingContentInfo(updatedContent));
          onNameChange(updatedContent);
          return {...chapter, episodes: updatedEpisodes};
        }
        return chapter;
      }),
    );
  };

  const handleCreateEpisode = () => {
    // const confirmation = window.confirm('에피소드를 추가하고 새 에피소드 수정으로 이동하시겠습니까?');

    // if (confirmation) {
    if (selectedChapterIdx !== null) {
      const newEpisodeId = getMinEpisodeId(chapters);

      if (newEpisodeId != null) {
        const newEpisodeInfo: EpisodeInfo = {
          ...emptyData.data.contentInfo.chapterInfoList[0].episodeInfoList[0],
          id: newEpisodeId - 1,
          name: `New Episode ${newEpisodeId - 1}`,
        };

        const newEpisode = {
          id: newEpisodeInfo.id,
          title: newEpisodeInfo.name,
          thumbnail: newEpisodeInfo.backgroundImageUrl,
          description: newEpisodeInfo.episodeDescription,
          triggerInfoList: newEpisodeInfo.triggerInfoList,
          conversationTemplateList: newEpisodeInfo.conversationTemplateList,
        };

        onAddEpisode(newEpisodeInfo);

        setChapters(prevChapters =>
          prevChapters.map((chapter, index) =>
            index === selectedChapterIdx ? {...chapter, episodes: [...chapter.episodes, newEpisode]} : chapter,
          ),
        );
      }
    }
    // }
  };

  const handleDeleteEpisode = (chapterIdx: number, episodeIdx: number) => {
    setConfirmDialog({
      open: true,
      title: 'Discard Episode',
      content: `"${chapters[chapterIdx].episodes[episodeIdx].title}" 에피소드를 삭제하시겠습니까?`,
      onConfirm: () => {
        onDeleteEpisode(chapterIdx, episodeIdx);
        setChapters(prev =>
          prev.map((chapter, idx) =>
            idx === chapterIdx
              ? {...chapter, episodes: chapter.episodes.filter((_, epIdx) => epIdx !== episodeIdx)}
              : chapter,
          ),
        );
      },
    });
  };

  // Edit 팝업 열기
  const handleEditClick = (idx: number, type: 'chapter' | 'episode') => {
    if (type === 'episode') {
      dispatch(setSelectedEpisodeIdx(idx));
    }
    // 선택된 항목의 기존 이름 설정
    const currentName =
      type === 'chapter'
        ? chapters[idx].title // 챕터의 이름
        : chapters[selectedChapterIdx]?.episodes[idx]?.title || '';

    setEditItem({idx, type});
    setNewName(currentName);
  };

  const handleDeleteChapterOpen = () => {};
  const handleDeleteChapterClose = () => {};

  const handleDeleteEpisodeOpen = () => {};
  const handleDeleteEpisodeClose = () => {};

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

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {width: '100vw', height: '100vh', maxWidth: '500px', margin: '0 auto'},
        }}
      >
        <Box className={styles.drawerContainer}>
          {/* Drawer Header */}
          <CreateDrawerHeader title="ChapterBoard" onClose={onClose} />

          {/* Create Chapter 버튼 */}
          <Box className={styles.imageButtonContainer}>
            <Button className={styles.imageButton} onClick={handleCreateChapter}>
              <HomeIcon />
              <Typography>Create Chapter</Typography>
            </Button>
          </Box>

          {/* Chapter 및 Episode 트리 구조 */}
          <Box className={styles.contentBox}>
            {chapters.map((chapter, index) => (
              <ChapterItem
                key={index}
                chapter={chapter}
                chapterIdx={index}
                chapterLength={chapters.length}
                episodeLength={chapters[index].episodes.length}
                onDelete={handleDeleteChapter}
                onToggle={handleChapterToggle}
                onDeleteEpisode={handleDeleteEpisode}
                onSelect={handleChapterSelect}
                onSelectEpisode={handleEpisodeSelect}
                onEdit={handleEditClick}
                onCloseChapterBoard={onClose}
                isSelected={selectedChapterIdx === index}
                selectedEpisodeIdx={selectedEpisodeIdx}
                disableDelete={chapters.length <= 1}
                onDeleteChapterOpen={handleDeleteChapterOpen}
                onDeleteChapterClose={handleDeleteChapterClose}
                onDeleteEpisodeOpen={handleDeleteEpisodeOpen}
                onDeleteEpisodeClose={handleDeleteEpisodeClose}
              />
            ))}
          </Box>

          {/* Create Episode 버튼 */}
          <Box className={styles.imageButtonContainer}>
            <Button className={styles.imageButton} onClick={handleCreateEpisode}>
              <HomeIcon />
              <Typography>Create Episode</Typography>
            </Button>
          </Box>
        </Box>

        {/* 이름 변경을 위한 Dialog */}
        <Dialog open={editItem.idx !== null} onClose={() => setEditItem({idx: null, type: null})}>
          <DialogTitle>Edit {editItem.type === 'chapter' ? 'Chapter' : 'Episode'} Name</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="New Name"
              fullWidth
              value={newName}
              onChange={e => setNewName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditItem({idx: null, type: null})}>Cancel</Button>
            <Button
              onClick={() => {
                if (editItem.idx !== null && editItem.type) {
                  handleChangeName(editItem.idx, editItem.type, newName);
                  setEditItem({idx: null, type: null});
                }
              }}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
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
