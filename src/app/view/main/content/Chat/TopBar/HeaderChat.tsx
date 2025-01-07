'use client';
import React, {useEffect} from 'react';

import {Avatar, Box, IconButton} from '@mui/material';
import styles from './HeaderChat.module.css';
import {useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';
import {ChattingState} from '@/redux-store/slices/Chatting';
import {Left, Image, MenuDots} from '@ui/chatting';
import Link from 'next/link';
import {getLocalizedLink} from '@/utils/UrlMove';

interface ChatTopBarProps {
  onBackClick: () => void;
  onMoreClick: () => void;
  iconUrl: string;
  isHideChat: boolean;
  isBlurOn: boolean;
}

const TopBar: React.FC<ChatTopBarProps> = ({onBackClick, onMoreClick, iconUrl, isHideChat, isBlurOn}) => {
  const chattingState1: ChattingState = useSelector((state: RootState) => state.chatting);
  useEffect(() => {
    console.log('chattingState ', chattingState1);
  }, [chattingState1]);
  return (
    <>
      {isHideChat === false && (
        <>
          <Box className={`${styles.topNavigation} ${isBlurOn ? styles.blurOn : ''}`} sx={{width: window.innerWidth}}>
            <div className={styles.left}>
              <Link className={styles.button} href={getLocalizedLink(`/main/explore`) || '/default-path'}>
                <img className={styles.buttonImage} src={Left.src} />
              </Link>
            </div>
            <div className={styles.chat}>
              <Avatar
                src={iconUrl || '/images/001.png'}
                alt={chattingState1.contentName}
                className={styles.avatar}
                style={{width: '40px', height: '40px'}}
              />

              <div className={`${styles.textArea}  ${isBlurOn ? styles.blurOn : ''}`}>
                <span className={`${styles.contentName} ${isBlurOn ? styles.blurOn : ''}`}>
                  {chattingState1.contentName}
                </span>
                <span className={`${styles.episodeName}  ${isBlurOn ? styles.blurOn : ''}`}>
                  {chattingState1.episodeName}
                </span>
              </div>
            </div>
            <div className={styles.topButtonBox}>
              <IconButton className={styles.button}>
                <img className={styles.buttonImage} src={Image.src} />
              </IconButton>

              <IconButton className={styles.button} onClick={onMoreClick}>
                <img className={styles.buttonImage} src={MenuDots.src} />
              </IconButton>
            </div>
          </Box>
        </>
      )}
    </>
  );
};

export default TopBar;
