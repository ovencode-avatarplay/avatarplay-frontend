import React, {useEffect, useState} from 'react';
import {Box, IconButton, Typography} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import styles from './ButtonEpisodeInfo.module.css';

interface Props {
  onDrawerOpen: () => void;
  chapterName: string;
  episodeName: string;
}

const ButtonEpisodeInfo: React.FC<Props> = ({onDrawerOpen, chapterName, episodeName}) => {
  return (
    <Box className={styles.chapterInfo}>
      <FormatListBulletedIcon fontSize="large" />

      <Box display="flex" flexDirection="column" className={styles.chapterDetails}>
        <Typography variant="subtitle1">{chapterName}</Typography>
        <Typography variant="h6">{episodeName}</Typography>
      </Box>

      <IconButton onClick={onDrawerOpen} className={styles.arrowButton}>
        <ChevronRightIcon fontSize="large" />
      </IconButton>
    </Box>
  );
};

export default ButtonEpisodeInfo;
