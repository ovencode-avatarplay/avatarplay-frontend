'use client';
import React, {useEffect, useState} from 'react';

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
import ChatLevelModal from '../EventTrigger/ChatLevelModal';

interface ChatTopBarProps {
  onBackClick: () => void;
  onMoreClick: () => void;
  onLiveChatClick: () => void;
  iconUrl: string;
  isHideChat: boolean;
  isBlurOn: boolean;
  showEventGuage: boolean;
  level: number | null;
  exp: number | null;
  rewardItems: any[];
}

const TopBar: React.FC<ChatTopBarProps> = ({
  onBackClick,
  onMoreClick,
  onLiveChatClick,
  iconUrl,
  isHideChat,
  isBlurOn,
  showEventGuage,
  level,
  exp,
  rewardItems,
}) => {
  const {back} = useCustomRouter();
  const router = useRouter();
  const chattingState1: ChattingState = useSelector((state: RootState) => state.chatting);
  // useEffect(() => {
  //   console.log('chattingState ', chattingState1);
  // }, [chattingState1]);

  const routerBack = () => {
    back('/main/explore');
  };
  const [isOpen, setIsOpen] = useState(false);

  console.log('rewardItems ', rewardItems);

  return (
    <>
      {isHideChat === false && (
        <div className={styles.topBarContainer}>
          <Box className={`${styles.topNavigation} ${isBlurOn ? styles.blurOn : ''}`} sx={{width: '100%'}}>
            <div className={styles.left}>
              <img
                className={styles.buttonImage}
                src={Left.src}
                onClick={() => {
                  routerBack();
                }}
              />
            </div>
            <div
              className={styles.chat}
              onClick={() => {
                setIsOpen(true);
              }}
            >
              <div
                className={styles.rewardBorderWrapper}
                style={{
                  background:
                    level !== null
                      ? level >= 60
                        ? rewardItems[3].border
                        : level >= 40
                        ? rewardItems[2].border
                        : level >= 20
                        ? rewardItems[1].border
                        : rewardItems[0].border
                      : 'transparent',
                  padding: '4px',
                  borderRadius: '50%',
                }}
              >
                <Avatar
                  src={iconUrl || '/images/001.png'}
                  alt={chattingState1.storyName}
                  className={styles.avatar}
                  style={{width: '40px', height: '40px'}}
                />
              </div>

              <div className={`${styles.textArea}  ${isBlurOn ? styles.blurOn : ''}`}>
                {level !== null && (
                  <div
                    className={styles.characterLevel}
                    style={{
                      backgroundColor:
                        level !== null
                          ? level >= 60
                            ? rewardItems[3].color
                            : level >= 30
                            ? rewardItems[2].color
                            : level >= 10
                            ? rewardItems[1].color
                            : rewardItems[0].color
                          : undefined,
                    }}
                  >
                    LV.{level}
                  </div>
                )}
                <span className={`${styles.contentName} ${isBlurOn ? styles.blurOn : ''}`}>
                  {chattingState1.storyName}
                </span>
                {chattingState1.episodeName && (
                  <span className={`${styles.episodeName}  ${isBlurOn ? styles.blurOn : ''}`}>
                    {chattingState1.episodeName}
                  </span>
                )}
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
          {showEventGuage && (
            <div className={styles.eventGuageContainer}>
              {/* <CharacterLevelGuage
                level={level ?? 0}
                exp={exp ?? 0}
                canClick={true}
                profileImage={iconUrl}
                bubbleText={chattingState1.storyName}
                rewardItems={rewardItems}
              /> */}
            </div>
          )}
          <ChatLevelModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            level={level ?? 0}
            exp={exp ?? 0}
            profileImage={iconUrl}
            bubbleText={chattingState1.storyName}
            rewardItems={rewardItems}
          />
        </div>
      )}
    </>
  );
};

export default TopBar;
