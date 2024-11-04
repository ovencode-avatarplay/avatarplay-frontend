import React from 'react';
import {Drawer, Box, Typography} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import BookIcon from '@mui/icons-material/Book';
import PostAddIcon from '@mui/icons-material/PostAdd';
import Link from 'next/link';

import Style from './CreateWidget.module.css';

interface Props {
  open: boolean;
  onClose: () => void;
}

const CreateWidget: React.FC<Props> = ({open, onClose}) => {
  const handleClickCharacter = () => {
    onClose;
  };

  const handleClickStory = () => {
    onClose;
  };

  const handleClickPost = () => {
    onClose;
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      ModalProps={{
        BackdropProps: {
          style: {backgroundColor: 'transparent'},
        },
      }}
      PaperProps={{
        sx: {
          position: 'absolute',
          bottom: 56,
          zIndex: 10,
          maxWidth: '500px',
          margin: '0 auto',
        },
      }}
    >
      <Box className={Style.drawerBox}>
        {/* Character Navigation */}
        <Link href="/:lang/create/artist" passHref>
          <Box className={Style.drawerItem} onClick={handleClickCharacter}>
            <PersonIcon fontSize="large" />
            <Typography>Character</Typography>
          </Box>
        </Link>

        {/* Story Navigation */}
        <Link href="/:lang/create/story" passHref>
          <Box className={Style.drawerItem} onClick={handleClickStory}>
            <BookIcon fontSize="large" />
            <Typography>Story</Typography>
          </Box>
        </Link>

        {/* Post Navigation */}
        <Link href="/:lang/create/post" passHref>
          <Box className={Style.drawerItem} onClick={handleClickPost}>
            <PostAddIcon fontSize="large" />
            <Typography>Post</Typography>
          </Box>
        </Link>
      </Box>
    </Drawer>
  );
};

export default CreateWidget;
