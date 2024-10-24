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
import Style from './ChapterBoard.module.css';

// Slice
import {setSelectedChapterIdx, setSelectedEpisodeIdx} from '@/redux-store/slices/ContentSelection';
import {updateEditingContentInfo} from '@/redux-store/slices/ContentInfo';

// Components
import ChapterItem from './ChapterItem';
import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';

// Types
import {Chapter} from '@/types/apps/chapterCardType';
import {ChapterInfo} from '@/types/apps/content/chapter/chapterInfo';
import {EpisodeInfo} from '@/types/apps/content/episode/episodeInfo';

// Data
import defaultData from '@/data/create/content-info-data.json';
import emptyData from '@/data/create/empty-content-info-data.json';
import {setCurrentEpisodeInfo} from '@/redux-store/slices/EpisodeInfo';

interface Props {
  open: boolean;
  onClose: () => void;
  initialChapters: ChapterInfo[];
  onAddChapter: (newChapter: ChapterInfo) => void;
  onDeleteChapter: (chapterId: number) => void;
  onAddEpisode: (newEpisode: EpisodeInfo) => void;
  onDeleteEpisode: (chapterId: number, episodeId: number) => void;
  onNameChange: () => void;
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
  const [editItem, setEditItem] = useState<{idx: number | null; type: 'chapter' | 'episode' | null}>({
    idx: null,
    type: null,
  });
  const [newName, setNewName] = useState<string>('');
  const dispatch = useDispatch();

  // ChapterInfo를 Chapter로 변환하는 함수
  const transformChapterInfoToChapter = (chapterInfoList: ChapterInfo[]): Chapter[] => {
    return chapterInfoList.map(chapterInfo => ({
      id: chapterInfo.id,
      title: chapterInfo.name,
      episodes: chapterInfo.episodeInfoList.map(episodeInfo => ({
        id: episodeInfo.id,
        title: episodeInfo.name,
        thumbnail: episodeInfo.thumbnail,
        description: episodeInfo.episodeDescription,
        triggerInfoList: episodeInfo.triggerInfoList,
        conversationTemplateList: episodeInfo.conversationTemplateList,
        llmSetupInfo: episodeInfo.llmSetupInfo,
      })),
      expanded: false,
    }));
  };

  // ChapterInfo 배열을 컴포넌트 상태로 변환
  useEffect(() => {
    setChapters(transformChapterInfoToChapter(initialChapters));
  }, [initialChapters]);

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
    dispatch(setSelectedChapterIdx(chapterIdx));
    dispatch(setSelectedEpisodeIdx(0));
  };

  const handleCreateChapter = () => {
    const newChapterId = getMaxId(chapters) + 1;

    const newChapter: ChapterInfo = {
      id: newChapterId,
      name: 'New Chapter',
      episodeInfoList: [],
    };

    onAddChapter(newChapter);
  };

  const handleDeleteChapter = (chapterIdx: number) => {
    if (chapters.length > 1) {
      const validChapterIdx = chapterIdx >= chapters.length ? 0 : chapterIdx;

      onDeleteChapter(chapterIdx);

      setChapters(prevChapters => prevChapters.filter((_, index) => index !== validChapterIdx));

      if (validChapterIdx >= chapters.length - 1) {
        dispatch(setSelectedEpisodeIdx(0));
        dispatch(setSelectedChapterIdx(0));
      }
    }
  };
  //#endregion

  //#region Episode

  const handleEpisodeSelect = (chapterIdx: number, episodeIdx: number) => {
    dispatch(setSelectedChapterIdx(chapterIdx));
    dispatch(setSelectedEpisodeIdx(episodeIdx));
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
          onNameChange();
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
          onNameChange();
          return {...chapter, episodes: updatedEpisodes};
        }
        return chapter;
      }),
    );
  };

  const handleCreateEpisode = () => {
    if (selectedChapterIdx !== null) {
      const selectedChapterData = chapters[selectedChapterIdx];
      const newEpisodeId = getMaxId(selectedChapterData?.episodes || []) + 1;

      const newEpisodeInfo: EpisodeInfo = {
        ...emptyData.data.contentInfo.chapterInfoList[0].episodeInfoList[0],
        id: newEpisodeId,
      };

      const newEpisode = {
        id: newEpisodeInfo.id,
        title: newEpisodeInfo.name,
        thumbnail: newEpisodeInfo.thumbnail,
        description: newEpisodeInfo.episodeDescription,
        triggerInfoList: newEpisodeInfo.triggerInfoList,
        conversationTemplateList: newEpisodeInfo.conversationTemplateList,
        llmSetupInfo: newEpisodeInfo.llmSetupInfo,
      };

      onAddEpisode(newEpisodeInfo);

      setChapters(prevChapters =>
        prevChapters.map((chapter, index) =>
          index === selectedChapterIdx ? {...chapter, episodes: [...chapter.episodes, newEpisode]} : chapter,
        ),
      );
    }
  };

  const handleDeleteEpisode = (chapterIdx: number, episodeIdx: number) => {
    onDeleteEpisode(chapterIdx, episodeIdx);
    setChapters(prevChapters =>
      prevChapters.map((chapter, index) => {
        if (index === chapterIdx && chapter.episodes.length > 1) {
          return {
            ...chapter,
            episodes: chapter.episodes.filter((_, epIdx) => epIdx !== episodeIdx),
          };
        }
        return chapter;
      }),
    );
  };

  // Edit 팝업 열기
  const handleEditClick = (idx: number, type: 'chapter' | 'episode') => {
    if (type === 'episode') {
      dispatch(setSelectedEpisodeIdx(idx));
    }
    setEditItem({idx, type});
    setNewName('');
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {width: '100vw', height: '100vh'},
      }}
    >
      <Box className={Style.drawerContainer}>
        {/* Drawer Header */}
        <CreateDrawerHeader title="ChapterBoard" onClose={onClose} />

        {/* Create Chapter 버튼 */}
        <Box className={Style.imageButtonContainer}>
          <Button className={Style.imageButton} onClick={handleCreateChapter}>
            <HomeIcon />
            <Typography>Create Chapter</Typography>
          </Button>
        </Box>

        {/* Chapter 및 Episode 트리 구조 */}
        <Box className={Style.contentBox}>
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
            />
          ))}
        </Box>

        {/* Create Episode 버튼 */}
        <Box className={Style.imageButtonContainer}>
          <Button className={Style.imageButton} onClick={handleCreateEpisode}>
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
  );
};

export default ChapterBoard;
