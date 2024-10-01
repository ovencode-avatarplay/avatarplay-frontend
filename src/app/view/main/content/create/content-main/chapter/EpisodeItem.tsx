import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Style from './ChapterBoard.module.css';
import { Episode } from '@/types/apps/episodeCardType';

interface EpisodeItemProps {
  episode: Episode;
  chapterId: number;
  onEditEpisode: (id: number, type: 'episode') => void; 
  onDeleteEpisode: (chapterId: number, episodeId: number) => void;
  disableDelete: boolean;
  onSelect: (chapterId: number, episodeId: number) => void; // 선택된 Episode 처리
  isSelected: boolean; // 선택 여부
}

const EpisodeItem: React.FC<EpisodeItemProps> = ({
  episode,
  chapterId,
  onEditEpisode,
  onDeleteEpisode,
  disableDelete,
  onSelect,
  isSelected,
}) => {
  return (
    <Box
      className={Style.episodeBox}
    >
      <Box className={Style.episodeHeader} onClick={() => onSelect(chapterId, episode.id)}>
        <Typography>{episode.title}</Typography>

        {/* Edit 버튼 */}
        <IconButton onClick={() => onEditEpisode(episode.id, 'episode')}>
          <EditIcon />
        </IconButton>
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
