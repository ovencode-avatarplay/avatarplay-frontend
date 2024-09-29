import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Style from './ChapterBoard.module.css';
import { Episode } from '@/types/apps/episodeCardType';

interface EpisodeItemProps {
  episode: Episode;
  chapterId: number;
  onDeleteEpisode: (chapterId: number, episodeId: number) => void;
  disableDelete: boolean;
  onSelect: (chapterId: number, episodeId: number) => void; // 선택된 Episode 처리
  isSelected: boolean; // 선택 여부
}

const EpisodeItem: React.FC<EpisodeItemProps> = ({
  episode,
  chapterId,
  onDeleteEpisode,
  disableDelete,
  onSelect,
  isSelected,
}) => {
  return (
    <Box
      className={Style.episodeBox}
      sx={{
        backgroundColor: isSelected ? 'green' : 'transparent', // 선택된 경우 초록색 배경
      }}
    >
      <Box className={Style.episodeHeader} onClick={() => onSelect(chapterId, episode.id)}>
        <Typography>{episode.title}</Typography>

        {/* Episode 삭제 버튼 */}
        {!disableDelete && (
          <IconButton className={Style.deleteButton} onClick={() => onDeleteEpisode(chapterId, episode.id)}>
            <DeleteIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default EpisodeItem;
