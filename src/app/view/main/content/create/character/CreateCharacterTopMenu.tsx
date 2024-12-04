import React, {useEffect, useState} from 'react';

import {Box, IconButton} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import StudioIcon from '@mui/icons-material/VideoLibrary';
import styles from './CreateCharacterTopMenu.module.css';

import Link from 'next/link';

interface CreateCharacterTopMenuProps {
  backButtonAction?: () => void;
  lastUrl?: string;
  contentTitle: string;
  blockStudioButton?: boolean;
}

const CreateCharacterTopMenu: React.FC<CreateCharacterTopMenuProps> = ({
  backButtonAction,
  lastUrl,
  contentTitle,
  blockStudioButton = false,
}) => {
  const [title, setTitle] = useState(contentTitle);
  const defaultUrl = '../main/homefeed';
  const studioUrl = '../studio/character';

  useEffect(() => {
    setTitle(contentTitle);
  }, [contentTitle]);

  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    const confirmation = window.confirm('You have unsaved changes. Are you sure you want to leave?');
    if (!confirmation) {
      event.preventDefault(); // 링크 이동 중단
    }
  };

  return (
    <Box className={styles.contentHeader}>
      {backButtonAction ? (
        <IconButton onClick={backButtonAction}>
          <ChevronLeftIcon fontSize="large" />
        </IconButton>
      ) : (
        <Link href={lastUrl ? lastUrl : defaultUrl} passHref onClick={handleLinkClick}>
          <IconButton>
            <ChevronLeftIcon fontSize="large" />
          </IconButton>
        </Link>
      )}
      <Box className={styles.titleContainer}>{title}</Box>
      {!blockStudioButton && (
        <Link href={studioUrl} passHref onClick={handleLinkClick}>
          <div className={styles.studioButton}>
            <IconButton>
              <StudioIcon />
            </IconButton>
          </div>
        </Link>
      )}
    </Box>
  );
};

export default CreateCharacterTopMenu;
