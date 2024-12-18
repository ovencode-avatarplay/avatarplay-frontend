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
import {LeftArrow, LineDashboard, LineEdit} from '@ui/Icons';
import EpisodeTitlePopup from './episode/EpisodeTitlePopup';

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
      <div className={styles.titleContainer}>
        <Link href={lastUrl ? lastUrl : defaultUrl} passHref onClick={handleLinkClick}>
          <img src={LeftArrow.src} />
        </Link>
        {contentName && contentName.trim() ? contentName : 'Story Name'}
      </div>

      <div>
        <IconButton>
          <img src={LineEdit.src} className={styles.blackIcon} />
        </IconButton>

        <IconButton onClick={onOpenDrawer}>
          <img src={LineDashboard.src} className={styles.blackIcon} />
        </IconButton>
      </div>
    </Box>
  );
};

export default ContentHeader;
