import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Collapse,
  IconButton,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import HomeIcon from '@mui/icons-material/Home';
import EditIcon from '@mui/icons-material/Edit';
import EpisodeItem from './EpisodeItem';
import Style from './ChapterBoard.module.css';
import {Chapter} from '@/types/apps/chapterCardType';
import {setSelectedChapterIdx, setSelectedEpisodeIdx} from '@/redux-store/slices/ContentSelection';
import {useDispatch} from 'react-redux';

interface ChapterItemProps {
  chapter: Chapter;
  chapterIdx: number; // 인덱스 추가
  chapterLength: number;
  episodeLength: number;
  onDelete: (chapterIdx: number) => void;
  onToggle: (chapterIdx: number) => void;
  onDeleteEpisode: (chapterIdx: number, episodeIdx: number) => void;
  onSelect: (chapterIdx: number) => void;
  onSelectEpisode: (chapterIdx: number, episodeIdx: number) => void;
  onCloseChapterBoard: () => void;
  onEdit: (idx: number, type: 'chapter' | 'episode') => void;
  isSelected: boolean; // 선택 여부
  selectedEpisodeIdx: number;
  disableDelete: boolean;
}

const ChapterItem: React.FC<ChapterItemProps> = ({
  chapter,
  chapterIdx,
  chapterLength,
  episodeLength,
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
  const dispatch = useDispatch();

  const handleDeleteChapter = (chapterIdx: number, chapterLength: number) => {
    onDelete(chapterIdx);

    if (chapterIdx >= chapterLength - 1) {
      dispatch(setSelectedChapterIdx(0));
      dispatch(setSelectedEpisodeIdx(0));
    }
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
          <Box className={Style.chapterHeader}>
            <HomeIcon />
            <Typography>{chapter.title}</Typography>

            <Box>
              <IconButton onClick={() => onEdit(chapterIdx, 'chapter')}>
                <EditIcon />
              </IconButton>

              {/* Chapter 삭제 버튼 */}
              {!disableDelete && (
                <IconButton
                  className={Style.deleteButton}
                  onClick={() => handleDeleteChapter(chapterIdx, chapterLength)}
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
