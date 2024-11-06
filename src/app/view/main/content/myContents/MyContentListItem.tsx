import React from 'react';
import {Box, Typography, IconButton} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatIcon from '@mui/icons-material/Chat';
import DeleteIcon from '@mui/icons-material/Delete';

import styles from './MyContentListItem.module.css';

interface Props {
  thumbnail: string;
  contentName: string;
  chapterName: string;
  episodeName: string;
  intimacy: number;
  chatCount: number;
  lastPlayedDate: string;

  contentInfo: string;
}

const MyContentListItem: React.FC<Props> = ({
  thumbnail,
  contentName,
  chapterName,
  episodeName,
  intimacy,
  chatCount,
  lastPlayedDate,
  contentInfo,
}) => {
  return (
    <Box className={styles.listItem}>
      <Box className={styles.thumbnail}>
        <img src={thumbnail} />
      </Box>

      <Box className={styles.description}>
        <Box className={styles.topRow}>
          <Typography variant="h6" className={styles.contentName}>
            {contentName}
          </Typography>
          <IconButton className={styles.infoButton}>
            <InfoIcon />
          </IconButton>
        </Box>

        <Box className={styles.middleRow}>
          <Box className={styles.namesColumn}>
            <Typography variant="body2">{chapterName}</Typography>
            <Typography variant="body2">{episodeName}</Typography>
          </Box>
          <Box className={styles.progressColumn}>
            <FavoriteIcon />
            <Typography variant="body2">{intimacy}</Typography>
          </Box>
        </Box>

        <Box className={styles.bottomRow}>
          <ChatIcon className={styles.chatIcon} />
          <Typography variant="body2">{chatCount}</Typography>
          <Typography variant="body2" className={styles.lastUsed}>
            {lastPlayedDate}
          </Typography>
          <IconButton className={styles.deleteButton}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default MyContentListItem;
