import React from 'react';

import {Drawer, Box, Typography, Button} from '@mui/material';

import Link from 'next/link';

import styles from './CreateWidget.module.css';
import getLocalizedText from '@/utils/getLocalizedText';
<<<<<<< HEAD
import {getLocalizedLink} from '@/utils/UrlMove';
=======
import {LineCharacter, LineEdit, LineStory} from '@ui/Icons';
>>>>>>> CreateStoryRemake

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
        className: styles.drawerContainer,
      }}
    >
<<<<<<< HEAD
      <Box>
        {/* Drawer 타이틀 */}
        <Typography variant="h5" className={styles.drawerTitle}>
          Create
        </Typography>

        {/* 항목 리스트 */}
        <Box>
          {/* Post */}
          <Link href={getLocalizedLink('/create/post')} passHref>
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
          <Link href={getLocalizedLink('/create/contents')} passHref>
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
          <Link href={getLocalizedLink('/create/character')} passHref>
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
          <Link href={getLocalizedLink('/create/story')} passHref>
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
=======
      <div className={styles.widgetBox}>
        <div className={styles.handleArea}>
          <div className={styles.handle} />
        </div>
        <div className={styles.drawerArea}>
          <div className={styles.drawerTitle}>Select Profile</div>
          <div className={styles.buttonArea}>
            <Link href="/:lang/create/post" passHref>
              <button className={`${styles.drawerButton} ${styles.drawerButtonTop}`} onClick={onClose}>
                <div className={styles.buttonItem}>
                  <img className={styles.buttonIcon} src={LineEdit.src} />
                  <div className={styles.buttonText}>Post</div>
                </div>
              </button>
            </Link>
            {/* <Link href="/:lang/create/contents" passHref>
            <button className={`${styles.drawerButton} ${styles.drawerButtonMid}`} 
              onClick={onClose}>
              <div className={styles.buttonItem}>
                <div className={styles.buttonIcon} />
                <div className={styles.buttonText}>Contents</div>
              </div>
            </button>
            </Link>
             */}
            <Link href="/:lang/create/character" passHref>
              <button className={`${styles.drawerButton} ${styles.drawerButtonMid}`} onClick={onClose}>
                <div className={styles.buttonItem}>
                  <img className={styles.buttonIcon} src={LineCharacter.src} />
                  <div className={styles.buttonText}>Character</div>
                </div>
              </button>
            </Link>
            <Link href="/:lang/create/story" passHref>
              <button className={`${styles.drawerButton} ${styles.drawerButtonBot}`} onClick={onClose}>
                <div className={styles.buttonItem}>
                  <img className={styles.buttonIcon} src={LineStory.src} />
                  <div className={styles.buttonText}>Story</div>
                </div>
              </button>
            </Link>
          </div>
        </div>
      </div>
>>>>>>> CreateStoryRemake
    </Drawer>
  );
};

export default CreateWidget;
