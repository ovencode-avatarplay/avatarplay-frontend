import React, {useEffect, useState} from 'react';
import {Box, TextField, IconButton} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import EditIcon from '@mui/icons-material/Edit';
import StudioIcon from '@mui/icons-material/VideoLibrary';
import Style from './ContentHeader.module.css';
import Link from 'next/link';

interface ContentHeaderProps {
  lastUrl?: string;
  onOpenDrawer: () => void; // 스튜디오 버튼 클릭 시 호출될 함수
  contentTitle: string;
  onTitleChange: (newTitle: string) => void;
}

const ContentHeader: React.FC<ContentHeaderProps> = ({lastUrl, onOpenDrawer, contentTitle, onTitleChange}) => {
  const [title, setTitle] = useState(contentTitle);
  const defaultUrl = '../main/homefeed';

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    onTitleChange(newTitle);
  };

  useEffect(() => {
    setTitle(contentTitle);
  }, [contentTitle]);

  return (
    <Box className={Style.contentHeader}>
      <Link href={lastUrl ? lastUrl : defaultUrl} passHref>
        <IconButton>
          <ChevronLeftIcon fontSize="large" />
        </IconButton>
      </Link>
      <Box className={Style.titleContainer}>
        <TextField
          variant="standard"
          value={title}
          aria-placeholder="Content Title Text"
          onChange={handleTitleChange}
          InputProps={{
            endAdornment: (
              <IconButton>
                <EditIcon />
              </IconButton>
            ),
          }}
          placeholder="Content Title Text"
          fullWidth
        />
      </Box>
      <div className={Style.studioButton}>
        <IconButton onClick={onOpenDrawer}>
          <StudioIcon />
        </IconButton>
      </div>
    </Box>
  );
};

export default ContentHeader;
