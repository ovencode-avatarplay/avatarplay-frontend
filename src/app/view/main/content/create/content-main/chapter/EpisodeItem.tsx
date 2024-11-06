import React from 'react';
import {Box, Button, IconButton, Typography} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import {EpisodeItemProps} from './ChapterTypes';

import styles from './ChapterBoard.module.css';

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
    <Box className={styles.episodeBox}>
      <Box
        className={styles.episodeHeader}
        sx={{
          backgroundColor: isSelected ? 'rgba(255, 0, 0, 0.1)' : 'inherit',
          border: isSelected ? '2px solid red' : '1px solid rgba(0, 0, 0, 0.12)',
          transition: 'background-color 0.3s ease, border 0.3s ease',
          padding: '8px',
          marginBottom: '8px',
        }}
        onClick={() => onSelect(chapterIdx, episodeIdx)}
      >
        <Button
          className={styles.episodeButton}
          style={{textTransform: 'none', justifyContent: 'flex-start', textAlign: 'left'}}
          onClick={() => onClose()}
        >
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
              className={styles.deleteButton}
              onClick={e => {
                e.stopPropagation(); // 이벤트 버블링 중단. 자식이벤트를 처리하고 난 후 부모 이벤트를 처리하는 상황 막기
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
