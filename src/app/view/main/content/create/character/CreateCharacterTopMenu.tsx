import React, {useEffect, useState} from 'react';
import {Box, TextField, IconButton} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import EditIcon from '@mui/icons-material/Edit';
import StudioIcon from '@mui/icons-material/VideoLibrary';

import Link from 'next/link';

import styles from './CreateCharacterTopMenu.module.css';

interface CreateCharacterTopMenuProps {
  lastUrl?: string;
  contentTitle: string;
}

const CreateCharacterTopMenu: React.FC<CreateCharacterTopMenuProps> = ({lastUrl, contentTitle}) => {
  const [title, setTitle] = useState(contentTitle);
  const defaultUrl = '../main/homefeed';
  const studioUrl = '../studio';

  useEffect(() => {
    setTitle(contentTitle);
  }, [contentTitle]);

  return (
    <Box className={styles.contentHeader}>
      <Link href={lastUrl ? lastUrl : defaultUrl} passHref>
        <IconButton>
          <ChevronLeftIcon fontSize="large" />
        </IconButton>
      </Link>
      <Box className={styles.titleContainer}>{title}</Box>
      <Link href={studioUrl} passHref>
        <div className={styles.studioButton}>
          <IconButton>
            <StudioIcon />
          </IconButton>
        </div>
      </Link>
    </Box>
  );
};

export default CreateCharacterTopMenu;
