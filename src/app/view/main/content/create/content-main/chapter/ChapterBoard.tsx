import React, { useEffect, useState } from 'react';
import { Drawer, Box, Button, Typography, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import ChapterItem from './ChapterItem';
import Style from './ChapterBoard.module.css';
import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';
import HomeIcon from '@mui/icons-material/Home';
import { Chapter } from '@/types/apps/chapterCardType';
import { ChapterInfo } from '@/types/apps/content/chapter/chapterInfo';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux-store/ReduxStore';
import { setSelectedChapter, setSelectedEpisode } from '@/redux-store/slices/ContentSelection'


interface Props {
  open: boolean;
  onClose: () => void;
  initialChapters: ChapterInfo[];
  onChapterNameChanged : (name : string) => void;
  onEpisodeNameChanged : (name : string) => void;
}

const ChapterBoard: React.FC<Props> = ({ open, onClose , initialChapters, onChapterNameChanged, onEpisodeNameChanged}) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const selectedChapter = useSelector((state: RootState) => state.contentselection.selectedChapter);
  const selectedEpisode = useSelector((state: RootState) => state.contentselection.selectedEpisode);
  const [editItem, setEditItem] = useState<{ id: number | null; type: 'chapter' | 'episode' | null }>({ id: null, type: null });
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
      })),
      expanded: false,
    }));
  };

  useEffect(() => {
    setChapters(transformChapterInfoToChapter(initialChapters)); // 변환된 데이터를 상태에 설정
  }, [initialChapters]);

  // Chapter 추가 (Episode 1 자동 추가)
  const handleCreateChapter = () => {
    const newChapter: Chapter = {
      id: chapters.length + 1,
      title: `Chapter ${chapters.length + 1}`,
      episodes: [{ id: 1, title: 'Episode 1' }],
      expanded: false,
    };
    setChapters([...chapters, newChapter]);
  };

  // Episode 추가
  const handleCreateEpisode = () => {
    if (selectedChapter !== null) {
      setChapters(prevChapters =>
        prevChapters.map(chapter =>
          chapter.id === selectedChapter
            ? {
                ...chapter,
                episodes: [
                  ...chapter.episodes,
                  { id: chapter.episodes.length + 1, title: `Episode ${chapter.episodes.length + 1}` },
                ],
              }
            : chapter
        )
      );
    }
  };

  // Chapter 삭제
  const handleDeleteChapter = (chapterId: number) => {
    if (chapters.length > 1) {
      setChapters(chapters.filter(chapter => chapter.id !== chapterId));
    }
  };

  // Episode 삭제
  const handleDeleteEpisode = (chapterId: number, episodeId: number) => {
    setChapters(prevChapters =>
      prevChapters.map(chapter => {
        if (chapter.id === chapterId && chapter.episodes.length > 1) {
          return {
            ...chapter,
            episodes: chapter.episodes.filter(episode => episode.id !== episodeId),
          };
        }
        return chapter;
      })
    );
  };

  // Chapter 펼치기/접기
  const handleChapterToggle = (chapterId: number) => {
    setChapters(prevChapters =>
      prevChapters.map(chapter =>
        chapter.id === chapterId ? { ...chapter, expanded: !chapter.expanded } : chapter
      )
    );
  };

  // Chapter 선택
  const handleChapterSelect = (chapterId: number) => {
    dispatch(setSelectedChapter(chapterId));
    dispatch(setSelectedEpisode(null));
  };

  // Episode 선택
  const handleEpisodeSelect = (chapterId: number, episodeId: number) => {
    dispatch(setSelectedEpisode({ chapterId, episodeId }));
    dispatch(setSelectedChapter(chapterId));
  };

  // Chapter 또는 Episode 이름 변경
  const handleChangeName = (id: number, type: 'chapter' | 'episode', newName: string) => {
    setChapters((prevChapters) =>
      prevChapters.map((chapter) => {
        if (type === 'chapter' && chapter.id === id) {
          {
            onChapterNameChanged(newName);
            return { ...chapter, title: newName };
          }
        }
        else
          if (type === 'episode' && selectedEpisode && chapter.id === selectedEpisode.chapterId) {
            {
              onEpisodeNameChanged(newName);
              return {
                ...chapter,
                episodes: chapter.episodes.map((episode) =>
                  episode.id === id ? { ...episode, title: newName } : episode
                ),
              };
            }
          }
        return chapter;
      })
    );
  };

  // Edit 팝업 열기
  const handleEditClick = (id: number, type: 'chapter' | 'episode') => {
    setEditItem({ id, type });
    setNewName('');
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: '100vw', height: '100vh' },
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
          {chapters.map((chapter) => (
            <ChapterItem
              key={chapter.id}
              chapter={chapter}
              onDelete={handleDeleteChapter}
              onToggle={handleChapterToggle}
              onDeleteEpisode={handleDeleteEpisode}
              onSelect={handleChapterSelect}
              onSelectEpisode={handleEpisodeSelect}
              onEdit={handleEditClick}
              isSelected={selectedChapter === chapter.id} 
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
      <Dialog open={editItem.id !== null} onClose={() => setEditItem({ id: null, type: null })}>
        <DialogTitle>Edit {editItem.type === 'chapter' ? 'Chapter' : 'Episode'} Name</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Name"
            fullWidth
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditItem({ id: null, type: null })}>Cancel</Button>
          <Button
            onClick={() => {
              if (editItem.id && editItem.type) {
                handleChangeName(editItem.id, editItem.type, newName);
                setEditItem({ id: null, type: null }); // 에디트 상태 초기화
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
