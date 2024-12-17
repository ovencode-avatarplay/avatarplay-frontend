import React from 'react';

import {Drawer, Box, Typography, Button} from '@mui/material';

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
        className: styles.drawerContainer,
      }}
    >
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
                  <div className={styles.buttonIcon} />
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
                  <div className={styles.buttonIcon} />
                  <div className={styles.buttonText}>Character</div>
                </div>
              </button>
            </Link>
            <Link href="/:lang/create/story" passHref>
              <button className={`${styles.drawerButton} ${styles.drawerButtonBot}`} onClick={onClose}>
                <div className={styles.buttonItem}>
                  <div className={styles.buttonIcon} />
                  <div className={styles.buttonText}>Story</div>
                </div>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default CreateWidget;
