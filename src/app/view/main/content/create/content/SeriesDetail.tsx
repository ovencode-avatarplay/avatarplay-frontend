import React, {useState} from 'react';
import styles from './SeriesDetail.module.css';
import {BoldArrowLeft, BoldShare, BoldLock, BoldHeart, BoldVideo, BoldStar, LineEdit, LinePlus} from '@ui/Icons';
export const mockSeries = {
  title: 'The White King',
  genres: ['Comedy', 'Love', 'Drama'],
  coverImage: '/mnt/data/image.png',
  episodes: [
    {
      id: 1,
      title: 'Pilot',
      duration: '45m',
      thumbnail: '/mnt/data/image.png',
      likes: 1450,
      comments: 23,
      rating: 12,
      locked: true,
    },
    {
      id: 2,
      title: 'Pilot',
      duration: '45m',
      thumbnail: '/mnt/data/image.png',
      likes: 1450,
      comments: 23,
      rating: 12,
      locked: true,
    },
    {
      id: 3,
      title: 'Pilot',
      duration: '45m',
      thumbnail: '/mnt/data/image.png',
      likes: 1450,
      comments: 23,
      rating: 12,
      locked: true,
    },
    {
      id: 4,
      title: 'Pilot',
      duration: '45m',
      thumbnail: '/mnt/data/image.png',
      likes: 1450,
      comments: 23,
      rating: 12,
      locked: true,
    },
  ],
};

interface Episode {
  id: number;
  title: string;
  duration: string;
  thumbnail: string;
  likes: number;
  comments: number;
  rating: number;
  locked: boolean;
}

export interface SeriesInfo {
  title: string;
  genres: string[];
  coverImage: string;
  episodes: Episode[];
}

interface SeriesDetailProps {
  seriesInfo: SeriesInfo;
  onNext: () => void;
  onPrev: () => void;
}

const SeriesDetail: React.FC<SeriesDetailProps> = ({onNext, onPrev, seriesInfo}) => {
  const [selectedSeason, setSelectedSeason] = useState(1);

  return (
    <div className={styles.container}>
      {/* 상단 배경 및 네비게이션 */}
      <div className={styles.header} style={{backgroundImage: `url(${seriesInfo.coverImage})`}}>
        <div className={styles.topNav}>
          <button className={styles.iconButton}>
            <img src={BoldArrowLeft.src} alt="Back" />
          </button>
          <button className={styles.iconButton}>
            <img src={LineEdit.src} alt="Edit" />
          </button>
        </div>
      </div>

      {/* 장르 및 공유 버튼 */}
      <div className={styles.genreShare}>
        <span className={styles.genres}>{seriesInfo.genres.join(' / ')}</span>
        <button className={styles.iconButton}>
          <img src={BoldShare.src} alt="Share" />
        </button>
      </div>

      {/* 탭 메뉴 (Episodes / About) */}
      <div className={styles.tabs}>
        <span className={styles.activeTab}>Episodes</span>
        <span className={styles.inactiveTab}>About</span>
      </div>

      {/* 시즌 선택 및 추가 버튼 */}
      <div className={styles.controls}>
        <button className={styles.seasonButton}>+ Add Season</button>
        <button className={styles.seasonDropdown}>Season {selectedSeason} ▼</button>
      </div>

      {/* 새로운 에피소드 추가 버튼 */}
      <button className={styles.addEpisode}>+ New Episode</button>

      {/* 에피소드 리스트 */}
      <div className={styles.episodeList}>
        {seriesInfo.episodes.map(ep => (
          <div key={ep.id} className={styles.episodeItem}>
            <div className={styles.episodeThumbnail} style={{backgroundImage: `url(${ep.thumbnail})`}}>
              {ep.locked && <img src={BoldLock.src} className={styles.lockIcon} alt="Locked" />}
              <div className={styles.episodeStats}>
                <span>
                  <img src={BoldHeart.src} className={styles.statIcon} /> {ep.likes}
                </span>
                <span>
                  <img src={BoldVideo.src} className={styles.statIcon} /> {ep.comments}
                </span>
              </div>
            </div>
            <div className={styles.episodeInfo}>
              <h3>
                {ep.id}. {ep.title}
              </h3>
              <p>{ep.duration}</p>
            </div>
            <div className={styles.episodeActions}>
              <button className={styles.iconButton}>
                <img src={LineEdit.src} alt="Edit" />
              </button>
              <div className={styles.rating}>
                <img src={BoldStar.src} className={styles.starIcon} />
                <span>{ep.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeriesDetail;
