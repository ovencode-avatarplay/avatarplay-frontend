import React from 'react';
import {Box, Button, Collapse, Typography} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import Style from './ChapterBoardOnTrigger.module.css';
import {Chapter} from '@/types/apps/chapterCardType';
import EpisodeItemOnTrigger from './EpisodeItemOnTrigger';

interface ChapterItemOnTriggerProps {
  chapter: Chapter;
  onToggle: (chapterId: number) => void;
  onSelect: (chapterId: number) => void;
  onSelectEpisode: (chapterID: number, episodeID: number) => void;
  onCloseChapterBoard: () => void;
  isSelected: boolean; // 선택 여부
  disableDelete: boolean;
}

const ChapterItemOnTrigger: React.FC<ChapterItemOnTriggerProps> = ({
  chapter,
  onToggle,
  onSelect,
  onSelectEpisode,
  onCloseChapterBoard,
  isSelected,
  disableDelete,
}) => {
  return (
    <Box className={Style.chapterBox}>
      {/* Chapter Header */}
      <Box className={Style.chapterHeader}>
        <Button
          className={Style.chapterButton}
          onClick={() => {
            onSelect(chapter.id);
            onToggle(chapter.id);
          }}
        >
          <HomeIcon />
          <Typography>{chapter.title}</Typography>
        </Button>
      </Box>

      {/* Chapter에 속한 Episode */}
      <Collapse in={chapter.expanded}>
        <Box className={Style.episodeContainer}>
          {chapter.episodes.map(episode => (
            <EpisodeItemOnTrigger
              key={episode.id}
              episode={episode}
              chapterId={chapter.id}
              disableDelete={chapter.episodes.length <= 1}
              onSelect={onSelectEpisode}
              onClose={onCloseChapterBoard}
              isSelected={isSelected}
            />
          ))}
        </Box>
      </Collapse>
    </Box>
  );
};

export default ChapterItemOnTrigger;
