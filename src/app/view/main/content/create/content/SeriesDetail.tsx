import React, {useState} from 'react';
import styles from './SeriesDetail.module.css';
import {BoldArrowLeft, BoldShare, BoldLock, BoldHeart, BoldVideo, BoldStar, LineEdit, LinePlus} from '@ui/Icons';
export const mockSeries = {
  title: 'The White King',
  genres: ['Comedy', 'Love', 'Drama'],
  coverImage: '/lora/anylora.png',
  episodes: [
    {
      id: 1,
      title: 'Pilot',
      duration: '45m',
      thumbnail: '/lora/anylora.png',
      likes: 1450,
      comments: 23,
      rating: 12,
    },
    {
      id: 2,
      title: 'Pilot',
      duration: '45m',
      thumbnail: '/lora/anylora.png',
      likes: 1450,
      comments: 23,
      rating: 12,
    },
    {
      id: 3,
      title: 'Pilot',
      duration: '45m',
      thumbnail: '/lora/anylora.png',
      likes: 1450,
      comments: 23,
      rating: 12,
    },
    {
      id: 4,
      title: 'Pilot',
      duration: '45m',
      thumbnail: '/lora/anylora.png',
      likes: 1450,
      comments: 23,
      rating: 12,
    },
    {
      id: 4,
      title: 'Pilot',
      duration: '45m',
      thumbnail: '/lora/anylora.png',
      likes: 1450,
      comments: 23,
      rating: 12,
    },
    {
      id: 4,
      title: 'Pilot',
      duration: '45m',
      thumbnail: '/lora/anylora.png',
      likes: 1450,
      comments: 23,
      rating: 12,
    },
    {
      id: 4,
      title: 'Pilot',
      duration: '45m',
      thumbnail: '/lora/anylora.png',
      likes: 1450,
      comments: 23,
      rating: 12,
    },
    {
      id: 4,
      title: 'Pilot',
      duration: '45m',
      thumbnail: '/lora/anylora.png',
      likes: 1450,
      comments: 23,
      rating: 12,
    },
    {
      id: 4,
      title: 'Pilot',
      duration: '45m',
      thumbnail: '/lora/anylora.png',
      likes: 1450,
      comments: 23,
      rating: 12,
    },
    {
      id: 4,
      title: 'Pilot',
      duration: '45m',
      thumbnail: '/lora/anylora.png',
      likes: 1450,
      comments: 23,
      rating: 12,
    },
    {
      id: 4,
      title: 'Pilot',
      duration: '45m',
      thumbnail: '/lora/anylora.png',
      likes: 1450,
      comments: 23,
      rating: 12,
    },
    {
      id: 4,
      title: 'Pilot',
      duration: '45m',
      thumbnail: '/lora/anylora.png',
      likes: 1450,
      comments: 23,
      rating: 12,
    },
    {
      id: 4,
      title: 'Pilot',
      duration: '45m',
      thumbnail: '/lora/anylora.png',
      likes: 1450,
      comments: 23,
      rating: 12,
    },
    {
      id: 4,
      title: 'Pilot',
      duration: '45m',
      thumbnail: '/lora/anylora.png',
      likes: 1450,
      comments: 23,
      rating: 12,
    },
    {
      id: 4,
      title: 'Pilot',
      duration: '45m',
      thumbnail: '/lora/anylora.png',
      likes: 1450,
      comments: 23,
      rating: 12,
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
  const [selectedTab, setSelectedTab] = useState<'Episodes' | 'About'>('Episodes');

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

      <div className={styles.contentContainer}>
        {/* 장르 및 공유 버튼 */}
        <div className={styles.genreShare}>
          <span className={styles.genres}>{seriesInfo.genres.join(' / ')}</span>
          <button className={styles.iconButton}>
            <img src={BoldShare.src} alt="Share" />
          </button>
        </div>

        {/* 탭 메뉴 */}
        <div className={styles.tabs}>
          <div className={styles.tabContainer}>
            <button
              className={`${styles.tabButton} ${selectedTab === 'Episodes' ? styles.activeTab : ''}`}
              onClick={() => setSelectedTab('Episodes')}
            >
              Episodes
            </button>
            <button
              className={`${styles.tabButton} ${selectedTab === 'About' ? styles.activeTab : ''}`}
              onClick={() => setSelectedTab('About')}
            >
              About
            </button>
            {/* 이동하는 밑줄 */}
            <div className={styles.tabUnderline} style={{left: selectedTab === 'Episodes' ? '0px' : '80px'}} />
          </div>
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
                <div className={styles.episodeStats}>
                  <span className={styles.stats}>
                    <img src={BoldHeart.src} className={styles.statIcon} /> {ep.likes}
                  </span>
                  <span className={styles.stats}>
                    <img src={BoldVideo.src} className={styles.statIcon} /> {ep.comments}
                  </span>
                </div>
              </div>
              <div className={styles.episodeInfo}>
                <div className={styles.epTitleText}>
                  {ep.id}. {ep.title}
                </div>
                <div className={styles.epDuration}>{ep.duration}</div>
              </div>
              <div className={styles.episodeActions}>
                <button className={styles.iconButton}>
                  <img src={LineEdit.src} alt="Edit" className={styles.editIcon} />
                </button>
                <div className={styles.rating}>
                  <img src={BoldStar.src} className={styles.starIcon} />
                  <span className={styles.rateText}>{ep.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeriesDetail;
