import React from 'react';
import {Accordion, AccordionDetails, AccordionSummary, Box, IconButton, Typography} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import HomeIcon from '@mui/icons-material/Home';
import EditIcon from '@mui/icons-material/Edit';

import EpisodeItem from './EpisodeItem';
import {ChapterItemProps} from './ChapterTypes';

import styles from './ChapterBoard.module.css';

const ChapterItem: React.FC<ChapterItemProps> = ({
  chapter,
  chapterIdx,
  chapterLength,
  onDelete,
  onToggle,
  onDeleteEpisode,
  onSelect,
  onSelectEpisode,
  onCloseChapterBoard,
  onEdit,
  isSelected,
  selectedEpisodeIdx,
  disableDelete,
}) => {
  const handleDeleteChapter = (chapterIdx: number, chapterLength: number) => {
    onDelete(chapterIdx);

    console.log(chapterIdx + '/' + chapterLength);
  };

  return (
    <>
      <Accordion
        expanded={isSelected}
        onChange={() => onToggle(chapterIdx)}
        sx={{
          backgroundColor: isSelected ? 'rgba(0, 123, 255, 0.1)' : 'inherit',
          border: isSelected ? '2px solid #007bff' : '1px solid rgba(0, 0, 0, 0.12)',
          transition: 'background-color 0.3s ease, border 0.3s ease',
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          onClick={() => {
            onSelect(chapterIdx); // 인덱스를 사용
            onToggle(chapterIdx);
          }}
        >
          <Box className={styles.chapterHeader} sx={{justifyContent: 'space-between', textAlign: 'left'}}>
            <HomeIcon />
            <Typography sx={{width: '60%'}}>{chapter.title}</Typography>

            <Box>
              <IconButton onClick={() => onEdit(chapterIdx, 'chapter')}>
                <EditIcon />
              </IconButton>

              {/* Chapter 삭제 버튼 */}
              {!disableDelete && (
                <IconButton
                  className={styles.deleteButton}
                  onClick={e => {
                    e.stopPropagation();
                    handleDeleteChapter(chapterIdx, chapterLength);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {chapter.episodes.map((episode, episodeIdx) => (
            <EpisodeItem
              key={episodeIdx}
              episode={episode}
              chapterIdx={chapterIdx}
              episodeIdx={episodeIdx} // 인덱스를 전달
              onEditEpisode={onEdit}
              onDeleteEpisode={onDeleteEpisode}
              disableDelete={chapter.episodes.length <= 1}
              onSelect={onSelectEpisode}
              onClose={onCloseChapterBoard}
              isSelected={selectedEpisodeIdx === episodeIdx}
            />
          ))}
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default ChapterItem;
