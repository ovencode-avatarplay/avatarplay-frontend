import React, {useEffect, useState} from 'react';

import styles from './ExploreCard.module.css'; // CSS 파일 임포트

import {useDispatch} from 'react-redux';
import {openDrawerContentId} from '@/redux-store/slices/DrawerContentDescSlice';

import {BoldChatRoundDots, BoldEpisodes, BoldFollowers, BoldLike} from '@ui/Icons';
import {getCurrentLanguage, getLocalizedLink} from '@/utils/UrlMove';
import {sendStoryByIdGet} from '@/app/NetWork/StoryNetwork';
import {useRouter} from 'next/navigation';
import {ExploreItem} from '@/app/NetWork/ExploreNetwork';
import {ContentType} from '@/app/NetWork/ContentNetwork';

interface Props {
  explore: ExploreItem;
  index?: number;
  classType?: string;
}

const ExploreCard: React.FC<Props> = ({explore, index, classType}) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const RankCounter = 3;

  const handleOpenDrawer = async () => {
    if (explore.exploreItemType === 0) {
      // Story는 기존 Drawer 열기
      const req = {
        storyId: explore.typeValueId,
        languageType: getCurrentLanguage(),
      };
      const response = await sendStoryByIdGet(req);
      if (response.resultCode == 0) {
        dispatch(openDrawerContentId(explore.typeValueId));
      }
    } else if (explore.exploreItemType === 1) {
      // Character는 프로필로 이동
      if (!explore.profileUrlLinkKey) {
        alert('프로필이 지원되지 않는 캐릭터입니다.');
        return;
      }
      router.push(getLocalizedLink('/profile/' + explore.profileUrlLinkKey + "?from=''"));
    } else if (explore.exploreItemType === 2) {
      // Content는 컨텐츠 화면으로 이동

      if (explore.contentType === ContentType.Single) {
        router.push(getLocalizedLink('/content/single/' + explore.contentUrlLinkKey + "?from=''"));
      } else if (explore.contentType === ContentType.Series) {
        router.push(getLocalizedLink('/content/series/' + explore.contentUrlLinkKey + "?from=''"));
      } else {
        alert('컨텐츠가 지원되지 않는 상태입니다.');
        return;
      }
    }
  };

  const getDataItem = (icon: number, text: string) => {
    return (
      <div className={styles.dataItem}>
        <img
          className={styles.dataIcon}
          src={
            icon === 0
              ? BoldChatRoundDots.src
              : icon === 1
              ? BoldFollowers.src
              : icon === 2
              ? BoldLike.src
              : BoldEpisodes.src
          }
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
        {explore.exploreItemType === 0 && (
          // Story
          <figure
            className={styles.exploreImage}
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.5)), url(${
                explore.thumbnail || '/images/001.png'
              })`,
              backgroundSize: 'cover',
            }}
            onClick={handleOpenDrawer}
          />
        )}
        {explore.exploreItemType === 1 && (
          // Character
          <figure
            className={styles.exploreImage}
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.5)), url(${
                explore.thumbnail || '/images/001.png'
              })`,
              backgroundSize: 'cover',
            }}
            onClick={handleOpenDrawer}
          />
        )}
        {explore.exploreItemType === 2 && (
          // Content
          <div className={styles.exploreMedia} onClick={handleOpenDrawer}>
            {explore.thumbnailMediaState === 2 ? (
              <video
                className={styles.exploreVideo}
                src={explore.thumbnail} // 동영상 URL
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <figure
                className={styles.exploreImage}
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.5)), url(${
                    explore.thumbnail || '/images/001.png'
                  })`,
                  backgroundSize: 'cover',
                }}
              />
            )}
          </div>
        )}

        {index !== undefined && index < RankCounter && (
          <div className={styles.rankArea}>
            <span className={styles.rankText}>{index + 1}</span>
          </div>
        )}

        <div className={styles.exploreOverlay}>
          <span className={styles.contentName}>{explore.name}</span>
          {/* {updateExplorState !== 0 && explore.exploreItemType !== 1 && (
            <div className={styles.isNewLabel}>{getUpdateState(updateExplorState)}</div>
          )} */}
          <div className={styles.dataArea}>
            {explore.exploreItemType === 0 || explore.exploreItemType === 1 ? (
              <>
                {getDataItem(0, formatNumber(explore.chatCount))}
                {getDataItem(1, formatNumber(explore.chatUserCount))}
              </>
            ) : (
              <>
                {getDataItem(2, formatNumber(explore.likeCount))}
                {getDataItem(3, formatNumber(explore.episodeCount))}
              </>
            )}
          </div>
        </div>
      </article>
    </>
  );
};

export default ExploreCard;
