import React, {useState} from 'react';

import styles from './ExploreCard.module.css'; // CSS 파일 임포트

import {useDispatch} from 'react-redux';
import {openDrawerContentId} from '@/redux-store/slices/DrawerContentDescSlice';
import {openDrawerCharacterId} from '@/redux-store/slices/DrawerCharacterDescSlice';

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
  style,
}) => {
  const dispatch = useDispatch();

  const RankCount = 3 + 1;

  const handleOpenDrawer = () => {
    if (exploreItemType === 0) {
      dispatch(openDrawerContentId(contentId));
    } else if (exploreItemType === 1) {
      dispatch(openDrawerCharacterId(contentId));

      // alert('캐릭터는 프로필로 갈 예정입니다. (프로필 작업 완료후 연결 필요)');
    }
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

  const formatNumber = (num: number) => {
    if (num >= 1e18) {
      return (num / 1e18).toFixed(1) + 'Qi'; // 10^18 (해)
    } else if (num >= 1e15) {
      return (num / 1e15).toFixed(1) + 'Qa'; // 10^15 (경)
    } else if (num >= 1e12) {
      return (num / 1e12).toFixed(1) + 'T'; // 10^12 (조)
    } else if (num >= 1e9) {
      return (num / 1e9).toFixed(1) + 'B'; // 10^9 (십억)
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(1) + 'M'; // 10^6 (백만)
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(1) + 'K'; // 10^3 (천)
    } else {
      return num.toString(); // 1000 미만은 그대로 출력
    }
  };

  return (
    <>
      <article className={`${styles.exploreCard} ${classType && getClassType(classType)}`}>
        <figure
          className={styles.exploreImage}
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.5)), url(${
              thumbnail || '/images/001.png'
            })`,
            backgroundSize: 'cover',
          }}
          onClick={handleOpenDrawer}
        />

        {contentRank && contentRank < RankCount && (
          <div className={styles.rankArea}>
            <span className={styles.rankText}>{contentRank}</span>
          </div>
        )}

        <div className={styles.exploreOverlay}>
          <span className={styles.contentName}>{contentName}</span>
          {updateExplorState !== 0 && exploreItemType !== 1 && (
            <div className={styles.isNewLabel}>{getUpdateState(updateExplorState)}</div>
          )}
          <div className={styles.dataArea}>
            {exploreItemType === 0 ? (
              <>
                {getDataItem(0, formatNumber(chatCount))}
                {getDataItem(1, formatNumber(episodeCount))}
              </>
            ) : (
              <>{getDataItem(2, formatNumber(followerCount))}</>
            )}
          </div>
        </div>
      </article>
    </>
  );
};

export default ExploreCard;
