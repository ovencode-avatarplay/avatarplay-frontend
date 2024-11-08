'use client';
import React from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import {Avatar, IconButton} from '@mui/material';
import styles from '@chats/Styles/StyleChat.module.css';
import {useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';
import {ChattingState} from '@/redux-store/slices/Chatting';
import BottomNavData from 'data/navigation/bottom-nav.json';
import Link from 'next/link';

interface ChatTopBarProps {
  onBackClick: () => void;
  onMoreClick: () => void;
  iconUrl: string;
  isHideChat: boolean;
}

const TopBar: React.FC<ChatTopBarProps> = ({onBackClick, onMoreClick, iconUrl, isHideChat}) => {
  const chattingState1: ChattingState = useSelector((state: RootState) => state.chatting);
  console.log('chattingState ', chattingState1);
  return (
    <>
      {isHideChat === false && (
        <div className={styles.topBar}>
          <div className={styles.left}>
            <Link href={BottomNavData.find(item => item.label === 'Explore')?.link || '/default-path'}>
              <IconButton className={styles.backButton} onClick={() => {}}>
                <ArrowBackIcon />
              </IconButton>
            </Link>

            <Avatar src={iconUrl || '/default-avatar.png'} alt={chattingState1.contentName} className={styles.avatar} />

            <div className={styles.userInfo}>
              <span className={styles.username}>{chattingState1.contentName}</span>
              <span className={styles.description}>{chattingState1.episodeName}</span>
            </div>
          </div>
          <div className={styles.right}>
            <IconButton className={styles.BackgroundButton}>
              <WallpaperIcon />
            </IconButton>

            <IconButton className={styles.moreButton} onClick={onMoreClick}>
              <MoreVertIcon />
            </IconButton>
          </div>
        </div>
      )}
    </>
  );
};

export default TopBar;
