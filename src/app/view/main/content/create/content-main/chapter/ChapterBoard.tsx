// Drawer

import React, { useState } from 'react';
import { Drawer, Box, Button, Typography } from '@mui/material';
import ChapterItem from './ChapterItem';
import Style from './ChapterBoard.module.css';
import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';
import HomeIcon from '@mui/icons-material/Home';
import { Chapter } from '@/types/apps/chapterCardType';

interface Props {
  open: boolean;
  onClose: () => void;
}

const ChapterBoard: React.FC<Props> = ({ open, onClose }) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null); // 선택된 Chapter ID
  const [selectedEpisode, setSelectedEpisode] = useState<{ chapterId: number; episodeId: number } | null>(null); // 선택된 Episode ID

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
      setChapters((prevChapters) =>
        prevChapters.map((chapter) =>
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
      setChapters(chapters.filter((chapter) => chapter.id !== chapterId));
    }
  };

  // Episode 삭제
  const handleDeleteEpisode = (chapterId: number, episodeId: number) => {
    setChapters((prevChapters) =>
      prevChapters.map((chapter) => {
        if (chapter.id === chapterId && chapter.episodes.length > 1) {
          return {
            ...chapter,
            episodes: chapter.episodes.filter((episode) => episode.id !== episodeId),
          };
        }
        return chapter;
      })
    );
  };

  // Chapter 펼치기/접기
  const handleChapterToggle = (chapterId: number) => {
    setChapters((prevChapters) =>
      prevChapters.map((chapter) =>
        chapter.id === chapterId ? { ...chapter, expanded: !chapter.expanded } : chapter
      )
    );
  };

  // Chapter 선택
  const handleChapterSelect = (chapterId: number) => {
    setSelectedChapter(chapterId);
    setSelectedEpisode(null); // Chapter 선택 시 Episode 선택 해제
  };

  // Episode 선택
  const handleEpisodeSelect = (chapterId: number, episodeId: number) => {
    setSelectedEpisode({ chapterId, episodeId });
    setSelectedChapter(chapterId); // 해당 Episode의 Chapter도 선택
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
              isSelected={selectedChapter === chapter.id} // 선택된 Chapter인지 확인
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
    </Drawer>
  );
};

export default ChapterBoard;
