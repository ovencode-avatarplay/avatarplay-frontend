import React from 'react';

import {Drawer, Box, Typography} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import BookIcon from '@mui/icons-material/Book';
import PostAddIcon from '@mui/icons-material/PostAdd';

import Link from 'next/link';

import styles from './CreateWidget.module.css';
import getLocalizedText from '@/utils/getLocalizedText';

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
      <Box className={styles.drawerBox}>
        {/* Character Navigation */}
        <Link href="/:lang/create/character" passHref>
          <Box className={styles.drawerItem} onClick={handleClickCharacter}>
            <PersonIcon fontSize="large" />
            <Typography>{getLocalizedText('widget_character')}</Typography>
          </Box>
        </Link>

        {/* Story Navigation */}
        <Link href="/:lang/create/story" passHref>
          <Box className={styles.drawerItem} onClick={handleClickStory}>
            <BookIcon fontSize="large" />
            <Typography>{getLocalizedText('widget_story')}</Typography>
          </Box>
        </Link>

        {/* Post Navigation */}
        <Link href="/:lang/create/post" passHref>
          <Box className={styles.drawerItem} onClick={handleClickPost}>
            <PostAddIcon fontSize="large" />
            <Typography>{getLocalizedText('widget_post')}</Typography>
          </Box>
        </Link>
      </Box>
    </Drawer>
  );
};

export default CreateWidget;
