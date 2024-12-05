import React from 'react';

import {Drawer, Box, Typography, Button} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import BookIcon from '@mui/icons-material/Book';
import PostAddIcon from '@mui/icons-material/PostAdd';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';

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
      PaperProps={{
        className: styles.drawerContainer, // 클래스 이름으로 스타일 적용
      }}
    >
      <Box>
        {/* Drawer 타이틀 */}
        <Typography variant="h5" className={styles.drawerTitle}>
          Create
        </Typography>

        {/* 항목 리스트 */}
        <Box>
          {/* Post */}
          <Link href="/:lang/create/post" passHref>
            <Button
              variant="outlined"
              onClick={onClose}
              className={styles.drawerButton}
              sx={{
                justifyContent: 'flex-start',
              }}
            >
              <PostAddIcon fontSize="large" className={styles.drawerButtonIcon} />
              <Typography variant="h6">Post</Typography>
            </Button>
          </Link>

          {/* Contents */}
          <Link href="/:lang/create/contents" passHref>
            <Button
              variant="outlined"
              onClick={onClose}
              className={styles.drawerButton}
              sx={{
                justifyContent: 'flex-start',
              }}
            >
              <ContentPasteIcon fontSize="large" className={styles.drawerButtonIcon} />
              <Typography variant="h6">Contents</Typography>
            </Button>
          </Link>

          {/* Character */}
          <Link href="/:lang/create/character" passHref>
            <Button
              variant="outlined"
              onClick={onClose}
              className={styles.drawerButton}
              sx={{
                justifyContent: 'flex-start',
              }}
            >
              <PersonIcon fontSize="large" className={styles.drawerButtonIcon} />
              <Typography variant="h6">Character</Typography>
            </Button>
          </Link>

          {/* Story */}
          <Link href="/:lang/create/story" passHref>
            <Button
              variant="outlined"
              onClick={onClose}
              className={styles.drawerButton}
              sx={{
                justifyContent: 'flex-start',
              }}
            >
              <BookIcon fontSize="large" className={styles.drawerButtonIcon} />
              <Typography variant="h6">Story</Typography>
            </Button>
          </Link>
        </Box>
      </Box>
    </Drawer>
  );
};

export default CreateWidget;
