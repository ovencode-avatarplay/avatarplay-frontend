import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';

// Css, MUI
import {Drawer, Box} from '@mui/material';
import styles from './ChapterBoardOnTrigger.module.css';

// Components
import ChapterItemOnTrigger from './ChapterItemOnTrigger';
import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';

// Types
import {ChapterInfo} from '@/redux-store/slices/ContentInfo';
import {EpisodeInfo} from '@/redux-store/slices/EpisodeInfo';
import {Chapter} from '../ChapterTypes';

interface Props {
  open: boolean;
  onClose: () => void;
  initialChapters: ChapterInfo[];
  onAddChapter: (newChapter: ChapterInfo) => void;
  onDeleteChapter: (chapterId: number) => void;
  onAddEpisode: (newEpisode: EpisodeInfo) => void;
  onDeleteEpisode: (chapterId: number, episodeId: number) => void;
  onSelectEpisode: (chapterId: number, episodeId: number) => void; // 추가된 함수
}

const ChapterBoardOnTrigger: React.FC<Props> = ({open, onClose, initialChapters, onAddChapter, onSelectEpisode}) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);

  const selectedChapter = useSelector((state: RootState) => state.contentselection.selectedChapterIdx);

  // ChapterInfo 배열을 컴포넌트 상태로 변환
  useEffect(() => {
    setChapters(
      initialChapters.map(chapterInfo => ({
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
      })),
    );
  }, [initialChapters]);

  // Chapter 토글 핸들러
  const handleChapterToggle = (chapterId: number) => {
    setChapters(prevChapters =>
      prevChapters.map(chapter => (chapter.id === chapterId ? {...chapter, expanded: !chapter.expanded} : chapter)),
    );
  };

  return (
    <Drawer
      sx={{zIndex: 1500}}
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

        {/* Chapter 및 Episode 트리 구조 */}
        <Box className={styles.contentBox}>
          {chapters.map((chapter, index) => (
            <ChapterItemOnTrigger
              key={chapter.id}
              chapter={chapter}
              onToggle={handleChapterToggle}
              onSelect={() => {}}
              onSelectEpisode={onSelectEpisode} // 전달된 함수 사용
              onCloseChapterBoard={onClose}
              isSelected={selectedChapter === index}
              disableDelete={chapters.length <= 1}
            />
          ))}
        </Box>
      </Box>
    </Drawer>
  );
};

export default ChapterBoardOnTrigger;
