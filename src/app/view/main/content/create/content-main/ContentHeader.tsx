import React from 'react';
import {Box, TextField, IconButton} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import EditIcon from '@mui/icons-material/Edit';
import StudioIcon from '@mui/icons-material/VideoLibrary';

import Link from 'next/link';

import styles from './ContentHeader.module.css';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';
import {setContentName} from '@/redux-store/slices/PublishInfo';

interface ContentHeaderProps {
  lastUrl?: string;
  onOpenDrawer: () => void; // 스튜디오 버튼 클릭 시 호출될 함수
  onTitleChange: (newTitle: string) => void;
}

const ContentHeader: React.FC<ContentHeaderProps> = ({lastUrl, onOpenDrawer, onTitleChange}) => {
  const contentName = useSelector((state: RootState) => state.publish.contentName);
  const defaultUrl = '../main/homefeed';
  const dispatch = useDispatch();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    dispatch(setContentName(newTitle));
    onTitleChange(newTitle);
  };

  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    const confirmation = window.confirm('You have unsaved changes. Are you sure you want to leave?');
    if (!confirmation) {
      event.preventDefault(); // 링크 이동 중단
    }
  };

  return (
    <Box className={styles.contentHeader}>
      <Link href={lastUrl ? lastUrl : defaultUrl} passHref onClick={handleLinkClick}>
        <IconButton>
          <ChevronLeftIcon fontSize="large" />
        </IconButton>
      </Link>
      <Box className={styles.titleContainer}>
        <TextField
          variant="standard"
          value={contentName}
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
      <div className={styles.studioButton}>
        <IconButton onClick={onOpenDrawer}>
          <StudioIcon />
        </IconButton>
      </div>
    </Box>
  );
};

export default ContentHeader;
