import React from 'react';
import {Box, Button, Collapse, IconButton, Typography} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import HomeIcon from '@mui/icons-material/Home';
import EditIcon from '@mui/icons-material/Edit';
import EpisodeItem from './EpisodeItem';
import Style from './ChapterBoard.module.css';
import {Chapter} from '@/types/apps/chapterCardType';

interface ChapterItemProps {
  chapter: Chapter;
  chapterIdx: number; // 인덱스 추가
  onDelete: (chapterIdx: number) => void;
  onToggle: (chapterIdx: number) => void;
  onDeleteEpisode: (chapterIdx: number, episodeIdx: number) => void;
  onSelect: (chapterIdx: number) => void;
  onSelectEpisode: (chapterIdx: number, episodeIdx: number) => void;
  onCloseChapterBoard: () => void;
  onEdit: (idx: number, type: 'chapter' | 'episode') => void;
  isSelected: boolean; // 선택 여부
  disableDelete: boolean;
}

const ChapterItem: React.FC<ChapterItemProps> = ({
  chapter,
  chapterIdx,
  onDelete,
  onToggle,
  onDeleteEpisode,
  onSelect,
  onSelectEpisode,
  onCloseChapterBoard,
  onEdit,
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
            onSelect(chapterIdx); // 인덱스를 사용
            onToggle(chapterIdx);
          }}
        >
          <HomeIcon />
          <Typography>{chapter.title}</Typography>
        </Button>

        <IconButton onClick={() => onEdit(chapterIdx, 'chapter')}>
          <EditIcon />
        </IconButton>

        {/* Chapter 삭제 버튼 */}
        {!disableDelete && (
          <IconButton className={Style.deleteButton} onClick={() => onDelete(chapterIdx)}>
            <DeleteIcon />
          </IconButton>
        )}
      </Box>

      {/* Chapter에 속한 Episode */}
      <Collapse in={chapter.expanded}>
        <Box className={Style.episodeContainer}>
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
              isSelected={isSelected}
            />
          ))}
        </Box>
      </Collapse>
    </Box>
  );
};

export default ChapterItem;
