import React from 'react';
import { Box, Button, Collapse, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import HomeIcon from '@mui/icons-material/Home';
import EditIcon from '@mui/icons-material/Edit'; 
import EpisodeItem from './EpisodeItem';
import Style from './ChapterBoard.module.css';
import { Chapter } from '@/types/apps/chapterCardType';

interface ChapterItemProps {
  chapter: Chapter;
  onDelete: (chapterId: number) => void;
  onToggle: (chapterId: number) => void;
  onDeleteEpisode: (chapterId: number, episodeId: number) => void;
  onSelect: (chapterId: number) => void;
  onSelectEpisode : (chapterID : number, episodeID : number) => void;
  onCloseChapterBoard : () => void;
  onEdit: (id: number, type: 'chapter' | 'episode') => void;
  isSelected: boolean; // 선택 여부
  disableDelete: boolean;
}

const ChapterItem: React.FC<ChapterItemProps> = ({
  chapter,
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
      <Box
        className={Style.chapterHeader}
      >
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

        <IconButton onClick={() => onEdit(chapter.id, 'chapter')}>
          <EditIcon />
        </IconButton>
        {/* Chapter 삭제 버튼 */}
        {!disableDelete && (
          <IconButton className={Style.deleteButton} onClick={() => onDelete(chapter.id)}>
            <DeleteIcon />
          </IconButton>
        )}
      </Box>

      {/* Chapter에 속한 Episode */}
      <Collapse in={chapter.expanded}>
        <Box className={Style.episodeContainer}>
          {chapter.episodes.map((episode) => (
            <EpisodeItem
              key={episode.id}
              episode={episode}
              chapterId={chapter.id}
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
