import React from 'react';
import {Box, Typography, IconButton} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatIcon from '@mui/icons-material/Chat';
import DeleteIcon from '@mui/icons-material/Delete';
import Style from './MyContentListItem.module.css';

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
    <Box className={Style.listItem}>
      <Box className={Style.thumbnail}>
        <img src={thumbnail} />
      </Box>

      <Box className={Style.description}>
        <Box className={Style.topRow}>
          <Typography variant="h6" className={Style.contentName}>
            {contentName}
          </Typography>
          <IconButton className={Style.infoButton}>
            <InfoIcon />
          </IconButton>
        </Box>

        <Box className={Style.middleRow}>
          <Box className={Style.namesColumn}>
            <Typography variant="body2">{chapterName}</Typography>
            <Typography variant="body2">{episodeName}</Typography>
          </Box>
          <Box className={Style.progressColumn}>
            <FavoriteIcon />
            <Typography variant="body2">{intimacy}</Typography>
          </Box>
        </Box>

        <Box className={Style.bottomRow}>
          <ChatIcon className={Style.chatIcon} />
          <Typography variant="body2">{chatCount}</Typography>
          <Typography variant="body2" className={Style.lastUsed}>
            {lastPlayedDate}
          </Typography>
          <IconButton className={Style.deleteButton}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default MyContentListItem;
