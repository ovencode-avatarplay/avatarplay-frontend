import React, {useState} from 'react';

import MovieIcon from '@mui/icons-material/Movie';
import ImageIcon from '@mui/icons-material/Image';

import styles from './ExploreCard.module.css'; // CSS 파일 임포트

import {useDispatch} from 'react-redux';
import {openDrawerContentId, setDrawerEpisodeId} from '@/redux-store/slices/DrawerContentDescSlice';

import {ExploreCardProps} from './SearchBoardTypes';

const ExploreCard: React.FC<ExploreCardProps> = ({contentId, contentName, chatCount, episodeCount, thumbnail}) => {
  const dispatch = useDispatch();

  const handleOpenDrawer = () => {
    dispatch(openDrawerContentId(contentId));
  };

  return (
    <>
      <div className={styles.exploreCard}>
        <img src={thumbnail} alt={thumbnail} className={styles.exploreImage} onClick={handleOpenDrawer} />
        <div className={styles.exploreOverlay}>
          <div className={styles.exploreInfo}>
            <div className={styles.exploreIcons}>
              <h3>ID:{contentId}</h3>
              <div className={styles.iconInfo}>
                <MovieIcon />
                <span>{chatCount}</span>
              </div>
              <div className={styles.iconInfo}>
                <ImageIcon />
                <span>{episodeCount}</span>
              </div>
            </div>
          </div>
        </div>
        <div>{contentName} </div>
      </div>
    </>
  );
};

export default ExploreCard;
