import React from 'react';
import styles from './ContentCard.module.css';
import {BoldChatRoundDots, BoldFollowers, BoldMenuDots, BoldStar, LineMenu} from '@ui/Icons';
import {ContentListInfo, VisibilityType} from '@/app/NetWork/ContentNetwork';

interface ContentCardProps {
  content: ContentListInfo;
  onAddEpisode: () => void;
}

const ContentCard: React.FC<ContentCardProps> = ({content, onAddEpisode}) => {
  return (
    <div className={styles.card}>
      {/* 상단 메뉴 */}
      <div className={styles.topMenu}>
        {content.name}
        <img src={BoldMenuDots.src} className={styles.menuDots}></img>
      </div>

      {/* 콘텐츠 정보 */}
      <div className={styles.contentSection}>
        <div className={styles.thumbnail}>
          <img src={content.thumbnailUrl} alt="Webtoon Thumbnail" />
          <span className={styles.status}>{VisibilityType[content.visibility]}</span>
        </div>

        <div className={styles.infoBox}>
          <p className={styles.genre}>{content.genre}</p>
          <p className={styles.description}>{content.description}</p>

          {/* 평점 및 조회수 */}
          {/* <div className={styles.bottomInfo}>
            <div className={styles.rating}>
              <img src={BoldStar.src} className={styles.star} /> {content.}
            </div>
          </div> */}

          {/* 에피소드 정보 */}
          <div className={styles.episodeInfo}>
            <strong>Episode {content.episodeCount}</strong>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <img src={BoldFollowers.src} className={styles.icon} alt="views" />
                {content.subscriberCount}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <button className={styles.addButton} onClick={onAddEpisode}>
        Add Episode
      </button>
    </div>
  );
};

export default ContentCard;
