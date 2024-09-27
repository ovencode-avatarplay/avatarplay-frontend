import React from 'react';
import { Box, Button, Collapse, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import HomeIcon from '@mui/icons-material/Home';
import EpisodeItem from './EpisodeItem';
import Style from './ChapterBoard.module.css';
import { Chapter } from '@/types/apps/chapterCardType';

interface ChapterItemProps {
  chapter: Chapter;
  onDelete: (chapterId: number) => void;
  onToggle: (chapterId: number) => void;
  onDeleteEpisode: (chapterId: number, episodeId: number) => void;
  onSelect: (chapterId: number) => void; // 선택된 Chapter 처리
  isSelected: boolean; // 선택 여부
  disableDelete: boolean;
}

const ChapterItem: React.FC<ChapterItemProps> = ({
  chapter,
  onDelete,
  onToggle,
  onDeleteEpisode,
  onSelect,
  isSelected,
  disableDelete,
}) => {
  return (
    <Box className={Style.chapterBox}>
      {/* Chapter Header */}
      <Box
        className={Style.chapterHeader}
        sx={{
          backgroundColor: isSelected ? 'green' : 'transparent', // 선택된 경우 초록색 배경
        }}
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
              onDeleteEpisode={onDeleteEpisode}
              disableDelete={chapter.episodes.length <= 1} // Episode가 1개일 때는 삭제 비활성화
              onSelect={onSelect} // Episode 선택 시 호출
              isSelected={isSelected} // 선택된 경우 스타일 적용
            />
          ))}
        </Box>
      </Collapse>
    </Box>
  );
};

export default ChapterItem;
