import React from 'react';
import {Box, Button, IconButton, Typography} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Style from './ChapterBoard.module.css';
import {Episode} from '@/types/apps/episodeCardType';

interface EpisodeItemProps {
  episode: Episode;
  chapterIdx: number; // 인덱스로 변경
  episodeIdx: number; // 인덱스로 변경
  onEditEpisode: (episodeIdx: number, type: 'episode') => void;
  onDeleteEpisode: (chapterIdx: number, episodeIdx: number) => void;
  onSelect: (chapterIdx: number, episodeIdx: number) => void; // 선택된 Episode 처리
  onClose: () => void;
  disableDelete: boolean;
  isSelected: boolean; // 선택 여부
}

const EpisodeItem: React.FC<EpisodeItemProps> = ({
  episode,
  chapterIdx,
  episodeIdx,
  onEditEpisode,
  onDeleteEpisode,
  disableDelete,
  onSelect,
  onClose,
  isSelected,
}) => {
  return (
    <Box className={Style.episodeBox}>
      <Box
        className={Style.episodeHeader}
        sx={{
          backgroundColor: isSelected ? 'rgba(255, 0, 0, 0.1)' : 'inherit',
          border: isSelected ? '2px solid red' : '1px solid rgba(0, 0, 0, 0.12)',
          transition: 'background-color 0.3s ease, border 0.3s ease',
          padding: '8px',
          marginBottom: '8px',
        }}
        onClick={() => onSelect(chapterIdx, episodeIdx)}
      >
        <Button className={Style.episodeButton} onClick={() => onClose()}>
          <Typography>{episode.title}</Typography>
        </Button>

        <Box>
          {/* Edit 버튼 */}
          <IconButton onClick={() => onEditEpisode(episodeIdx, 'episode')}>
            <EditIcon />
          </IconButton>

          {/* Episode 삭제 버튼 */}
          {!disableDelete && (
            <IconButton
              className={Style.deleteButton}
              onClick={() => {
                onSelect(chapterIdx, episodeIdx);
                onDeleteEpisode(chapterIdx, episodeIdx);
              }}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default EpisodeItem;
