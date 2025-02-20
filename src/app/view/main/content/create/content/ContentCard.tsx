import React from 'react';
import styles from './ContentCard.module.css';
import {BoldChatRoundDots, BoldFollowers, BoldMenuDots, BoldStar, LineMenu} from '@ui/Icons';

export const mockContentInfo: ContentInfo[] = [
  {
    imageUrl: '/lora/anylora.png',
    title: '어둠의 왕',
    description: '어둠 속에서 태어난 왕의 이야기..',
    genre: 'Fantasy / Action',
    status: 'Publishing',
    views: 12_500,
    comments: 320,
    rating: 4.8,
    episode: 12,
  },
  {
    imageUrl: '/lora/anylora.png',
    title: '미래에서 온 소년',
    description: '시간을 초월한 소년이 펼치는 모험!',
    genre: 'Sci-Fi / Adventure',
    status: 'Publishing',
    views: 8_450,
    comments: 780,
    rating: 4.5,
    episode: 8,
  },
  {
    imageUrl: '/lora/anylora.png',
    title: '그림자 속 그녀',
    description: '그림자 속에서 살아가는 그녀의 비밀...',
    genre: 'Thriller / Mystery',
    status: 'Saving',
    views: 5_900,
    comments: 230,
    rating: 4.7,
    episode: 4,
  },
  {
    imageUrl: '/lora/anylora.png',
    title: '어둠 속의 진실',
    description: '한 소녀가 어둠 속에서 찾은 진실...',
    genre: 'Horror / Thriller',
    status: 'Publishing',
    views: 10_300,
    comments: 540,
    rating: 4.9,
    episode: 6,
  },
  {
    imageUrl: '/lora/anylora.png',
    title: '빛과 그림자',
    description: '빛과 그림자가 공존하는 세계에서...',
    genre: 'Drama / Fantasy',
    status: 'Completed',
    views: 15_700,
    comments: 1_200,
    rating: 5.0,
    episode: 20,
  },
];

export interface ContentInfo {
  imageUrl: string; // 이미지 URL 추가
  title: string;
  description: string;
  genre: string;
  status: string;
  views: number;
  comments: number;
  rating: number;
  episode: number;
}

interface ContentCardProps {
  content: ContentInfo;
  onAddEpisode: () => void;
}

const ContentCard: React.FC<ContentCardProps> = ({content, onAddEpisode}) => {
  return (
    <div className={styles.card}>
      {/* 상단 메뉴 */}
      <div className={styles.topMenu}>
        <img src={BoldMenuDots.src} className={styles.menuDots}></img>
      </div>

      {/* 콘텐츠 정보 */}
      <div className={styles.contentSection}>
        <div className={styles.thumbnail}>
          <img src={content.imageUrl} alt="Webtoon Thumbnail" />
          <span className={styles.status}>{content.status}</span>
        </div>

        <div className={styles.infoBox}>
          <p className={styles.genre}>{content.genre}</p>
          <p className={styles.description}>{content.description}</p>

          {/* 평점 및 조회수 */}
          <div className={styles.bottomInfo}>
            <div className={styles.rating}>
              <img src={BoldStar.src} className={styles.star} /> {content.rating}
            </div>
          </div>

          {/* 에피소드 정보 */}
          <div className={styles.episodeInfo}>
            <strong>Episode {content.episode}</strong>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <img src={BoldFollowers.src} className={styles.icon} alt="views" />
                {content.views.toLocaleString()}
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
