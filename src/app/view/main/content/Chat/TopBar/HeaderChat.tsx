'use client';
import React, {useEffect} from 'react';

import {Avatar, Box, IconButton} from '@mui/material';
import styles from './HeaderChat.module.css';
import {useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';
import {ChattingState} from '@/redux-store/slices/Chatting';
import {Left, Image, MenuDots} from '@ui/chatting';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {getBackUrl} from '@/utils/util-1';
import {getLocalizedLink} from '@/utils/UrlMove';
import useCustomRouter from '@/utils/useCustomRouter';
import {LineCam, LineRecording} from '@ui/Icons';

interface ChatTopBarProps {
  onBackClick: () => void;
  onMoreClick: () => void;
  onLiveChatClick: () => void;
  iconUrl: string;
  isHideChat: boolean;
  isBlurOn: boolean;
}

const TopBar: React.FC<ChatTopBarProps> = ({
  onBackClick,
  onMoreClick,
  onLiveChatClick,
  iconUrl,
  isHideChat,
  isBlurOn,
}) => {
  const {back} = useCustomRouter();
  const router = useRouter();
  const chattingState1: ChattingState = useSelector((state: RootState) => state.chatting);
  useEffect(() => {
    console.log('chattingState ', chattingState1);
  }, [chattingState1]);

  const routerBack = () => {
    back('/main/explore');
  };

  return (
    <>
      {isHideChat === false && (
        <>
          <Box className={`${styles.topNavigation} ${isBlurOn ? styles.blurOn : ''}`} sx={{width: '100%'}}>
            <div className={styles.left}>
              <img
                className={styles.buttonImage}
                alt="Left Back"
                src={Left.src}
                onClick={() => {
                  routerBack();
                }}
              />
            </div>
            <div className={styles.chat}>
              <Avatar
                src={iconUrl || '/images/001.png'}
                alt={chattingState1.storyName}
                className={styles.avatar}
                style={{width: '40px', height: '40px'}}
              />

              <div className={`${styles.textArea}  ${isBlurOn ? styles.blurOn : ''}`}>
                <span className={`${styles.contentName} ${isBlurOn ? styles.blurOn : ''}`}>
                  {chattingState1.storyName}
                </span>
                <span className={`${styles.episodeName}  ${isBlurOn ? styles.blurOn : ''}`}>
                  {chattingState1.episodeName}
                </span>
              </div>
            </div>
            <div className={styles.topButtonBox}>
              <button className={styles.button} onClick={onLiveChatClick}>
                <img className={styles.buttonImage} src={LineCam.src} />
              </button>
              <button className={styles.button} onClick={onMoreClick}>
                <img className={styles.buttonImage} src={MenuDots.src} />
              </button>
            </div>
          </Box>
        </>
      )}
    </>
  );
};

export default TopBar;
