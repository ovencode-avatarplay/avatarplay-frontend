import React, {useState} from 'react';
import styles from './SeriesDetail.module.css';
import {BoldArrowLeft, BoldShare, BoldLock, BoldHeart, BoldVideo, BoldStar, LineEdit, LinePlus} from '@ui/Icons';
export const mockSingle = {
  title: 'The White King',
  genres: ['Comedy', 'Love', 'Drama'],
  coverImage: '/lora/anylora.png',
  id: 1,
  duration: '45m',
  thumbnail: '/lora/anylora.png',
  likes: 1450,
  comments: 23,
  rating: 12,
  description: 'asdadasdapofjogopghearpghearipugheaipuhgeaiupheipugeiapugiupeghpu',
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

export interface SingleInfo {
  id: number;
  title: string;
  genres: string[];
  coverImage: string;
  duration: string;
  thumbnail: string;
  likes: number;
  comments: number;
  rating: number;
  description: string;
}

interface SingleDetailProps {
  singleInfo: SingleInfo;
  onNext: () => void;
  onPrev: () => void;
}

const SingleDetail: React.FC<SingleDetailProps> = ({onNext, onPrev, singleInfo}) => {
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedTab, setSelectedTab] = useState<'Episodes' | 'About'>('Episodes');

  return (
    <div className={styles.container}>
      {/* 상단 배경 및 네비게이션 */}
      <div className={styles.header} style={{backgroundImage: `url(${singleInfo.coverImage})`}}>
        <div className={styles.topNav}>
          <button className={styles.iconButton} onClick={() => onPrev()}>
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
          <span className={styles.genres}>{singleInfo.genres.join(' / ')}</span>
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
              Content
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

        {selectedTab === 'Episodes' ? (
          <>
            {/* 에피소드 리스트 */}
            <div className={styles.episodeList}>
              <div className={styles.episodeItem}>
                <div className={styles.episodeThumbnail} style={{backgroundImage: `url(${singleInfo.thumbnail})`}}>
                  <div className={styles.episodeStats}>
                    <span className={styles.stats}>
                      <img src={BoldHeart.src} className={styles.statIcon} /> {singleInfo.likes}
                    </span>
                    <span className={styles.stats}>
                      <img src={BoldVideo.src} className={styles.statIcon} /> {singleInfo.comments}
                    </span>
                  </div>
                </div>
                <div className={styles.episodeInfo}>
                  <div className={styles.epTitleText}>
                    {singleInfo.id}. {singleInfo.title}
                  </div>
                  <div className={styles.epDuration}>{singleInfo.duration}</div>
                </div>
                <div className={styles.episodeActions}>
                  <button className={styles.iconButton}>
                    <img src={LineEdit.src} alt="Edit" className={styles.editIcon} />
                  </button>
                  <div className={styles.rating}>
                    <img src={BoldStar.src} className={styles.starIcon} />
                    <span className={styles.rateText}>{singleInfo.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={styles.episodeList}>{singleInfo.description}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default SingleDetail;
