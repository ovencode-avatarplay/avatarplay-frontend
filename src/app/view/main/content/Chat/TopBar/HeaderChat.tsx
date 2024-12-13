'use client';
import React, {useEffect} from 'react';

import {Avatar, IconButton} from '@mui/material';
import styles from './HeaderChat.module.css';
import {useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';
import {ChattingState} from '@/redux-store/slices/Chatting';
import BottomNavData from 'data/navigation/bottom-nav.json';
import {Left, Image, MenuDots} from '@ui/chatting';
import Link from 'next/link';

interface ChatTopBarProps {
  onBackClick: () => void;
  onMoreClick: () => void;
  iconUrl: string;
  isHideChat: boolean;
}

const TopBar: React.FC<ChatTopBarProps> = ({onBackClick, onMoreClick, iconUrl, isHideChat}) => {
  const chattingState1: ChattingState = useSelector((state: RootState) => state.chatting);
  useEffect(() => {
    console.log('chattingState ', chattingState1);
  }, [chattingState1]);
  return (
    <>
      {isHideChat === false && (
        <div className={styles.topNavigation}>
          <div className={styles.left}>
            <Link href={BottomNavData.find(item => item.label === 'Explore')?.link || '/default-path'}>
              <IconButton className={styles.backButton} onClick={() => {}}>
                <img src={Left.src} />
              </IconButton>
            </Link>
          </div>
          <div className={styles.chat}>
            <Avatar src={iconUrl || '/images/001.png'} alt={chattingState1.contentName} className={styles.avatar} />

            <div className={styles.textArea}>
              <span className={styles.contentName}>{chattingState1.contentName}</span>
              <span className={styles.episodeName}>{chattingState1.episodeName}</span>
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
        </div>
      )}
    </>
  );
};

export default TopBar;
