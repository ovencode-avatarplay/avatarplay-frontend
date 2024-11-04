import React from 'react';
import {Box, Typography, IconButton} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatIcon from '@mui/icons-material/Chat';
import DeleteIcon from '@mui/icons-material/Delete';
import Style from './MyContentListItem.module.css';

const MyContentListItem = () => {
  return (
    <Box className={Style.listItem}>
      <Box className={Style.thumbnail}>
        <img src="./Images/001.png" />
      </Box>

      <Box className={Style.description}>
        <Box className={Style.topRow}>
          <Typography variant="h6" className={Style.contentName}>
            Content Name
          </Typography>
          <IconButton className={Style.infoButton}>
            <InfoIcon />
          </IconButton>
        </Box>

        <Box className={Style.middleRow}>
          <Box className={Style.namesColumn}>
            <Typography variant="body2">Chapter Name</Typography>
            <Typography variant="body2">Episode Name</Typography>
          </Box>
          <Box className={Style.progressColumn}>
            <FavoriteIcon />
            <Typography variant="body2">80%</Typography>
          </Box>
        </Box>

        <Box className={Style.bottomRow}>
          <ChatIcon className={Style.chatIcon} />
          <Typography variant="body2">123</Typography>
          <Typography variant="body2" className={Style.lastUsed}>
            2024-11-04 16:00 PM
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
