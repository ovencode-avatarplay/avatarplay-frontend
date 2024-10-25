import React from 'react';
import {Box, Button, Typography} from '@mui/material';
import Style from './ChapterBoardOnTrigger.module.css';
import {Episode} from '@/types/apps/episodeCardType';

interface EpisodeItemOnTriggerProps {
  episode: Episode;
  chapterId: number;
  onSelect: (chapterId: number, episodeId: number) => void; // 선택된 Episode 처리
  onClose: () => void;
  disableDelete: boolean;
  isSelected: boolean; // 선택 여부
}

const EpisodeItemOnTrigger: React.FC<EpisodeItemOnTriggerProps> = ({
  episode,
  chapterId,
  disableDelete,
  onSelect,
  onClose,
  isSelected,
}) => {
  return (
    <Box className={Style.episodeBox}>
      <Box className={Style.episodeHeader} onClick={() => onSelect(chapterId, episode.id)}>
        <Button className={Style.episodeButton} onClick={onClose}>
          <Typography>{episode.title}</Typography>
        </Button>
      </Box>
    </Box>
  );
};

export default EpisodeItemOnTrigger;
