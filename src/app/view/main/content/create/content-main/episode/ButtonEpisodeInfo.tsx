import React from 'react';
import {Box, IconButton, Typography} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import styles from './ButtonEpisodeInfo.module.css';
import {LineEdit} from '@ui/Icons';

interface Props {
  onDrawerOpen: () => void;
  chapterName: string;
  episodeName: string;
}

const ButtonEpisodeInfo: React.FC<Props> = ({onDrawerOpen, chapterName, episodeName}) => {
  return (
    <div className={styles.chapterInfo}>
      <div className={styles.chapterName}>{chapterName}</div>
      <div className={styles.editButton} onClick={onDrawerOpen}>
        <img src={LineEdit.src} className={styles.editIcon} />
      </div>
    </div>
  );
};

export default ButtonEpisodeInfo;
