import React, {useEffect, useState} from 'react';
import {Box, IconButton, Typography} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import Style from './ButtonEpisodeInfo.module.css';

interface Props {
  onDrawerOpen: () => void;
  chapterName: string;
  episodeName: string;
}

const ButtonEpisodeInfo: React.FC<Props> = ({onDrawerOpen, chapterName, episodeName}) => {
  return (
    <Box className={Style.chapterInfo}>
      <FormatListBulletedIcon fontSize="large" />

      <Box display="flex" flexDirection="column" className={Style.chapterDetails}>
        <Typography variant="subtitle1">{chapterName}</Typography>
        <Typography variant="h6">{episodeName}</Typography>
      </Box>

      <IconButton onClick={onDrawerOpen} className={Style.arrowButton}>
        <ChevronRightIcon fontSize="large" />
      </IconButton>
    </Box>
  );
};

export default ButtonEpisodeInfo;
