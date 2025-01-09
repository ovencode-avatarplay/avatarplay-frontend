import React, {useState} from 'react';

import styles from './ExploreCard.module.css'; // CSS 파일 임포트

import {useDispatch} from 'react-redux';
import {openDrawerContentId} from '@/redux-store/slices/DrawerContentDescSlice';

import {ExploreCardProps} from './SearchBoardTypes';
import {BoldChatRoundDots, BoldEpisodes, BoldFollowers} from '@ui/Icons';

const ExploreCard: React.FC<ExploreCardProps> = ({
  exploreItemType,
  updateExplorState,
  contentId,
  contentRank,
  contentName,
  chatCount,
  episodeCount,
  followerCount,
  thumbnail,
  classType,
}) => {
  const dispatch = useDispatch();

  const RankCount = 3 + 1;

  const handleOpenDrawer = () => {
    dispatch(openDrawerContentId(contentId));
  };

  const getDataItem = (icon: number, text: string) => {
    return (
      <div className={styles.dataItem}>
        <img
          className={styles.dataIcon}
          src={icon === 0 ? BoldChatRoundDots.src : icon === 1 ? BoldEpisodes.src : BoldFollowers.src}
        />
        <div className={styles.dataText}>{text}</div>
      </div>
    );
  };

  const getUpdateState = (state: number) => {
    let result = '';
    switch (state) {
      case 1:
        result = 'New Season';
        break;
      case 2:
        result = 'New Episode';
        break;
      case 3:
        result = 'Recently Add';
        break;
      case 4:
        result = 'Top10';
        break;
    }

    return result;
  };

  const getClassType = (classType: string) => {
    return styles[classType] || ''; // classType이 유효하지 않으면 빈 문자열 반환
  };

  return (
    <>
      <div className={`${styles.exploreCard} ${classType && getClassType(classType)}`}>
        <div
          className={styles.exploreImage}
          style={{
            backgroundImage: `url(${thumbnail || '/images/001.png'})`,
            backgroundSize: 'cover',
          }}
          onClick={handleOpenDrawer}
        />

        {contentRank && contentRank < RankCount && (
          <div className={styles.rankArea}>
            <div className={styles.rankText}>{contentRank}</div>
          </div>
        )}

        <div className={styles.exploreOverlay}>
          <div className={styles.contentName}>{contentName}</div>
          {updateExplorState !== 0 && <div className={styles.isNewLabel}>{getUpdateState(updateExplorState)}</div>}
          <div className={styles.dataArea}>
            {exploreItemType === 0 ? (
              <>
                {getDataItem(0, chatCount.toString())}
                {getDataItem(1, episodeCount.toString())}
              </>
            ) : (
              <>{getDataItem(2, followerCount.toString())}</>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ExploreCard;
