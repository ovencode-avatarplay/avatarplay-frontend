import React, {useEffect, useState} from 'react';
import styles from './SeriesDetail.module.css';
import {BoldArrowLeft, BoldShare, BoldLock, BoldHeart, BoldVideo, BoldStar, LineEdit, LinePlus} from '@ui/Icons';
import {
  ContentInfo,
  ContentListInfo,
  CreateContentReq,
  GetContentReq,
  sendGetContent,
} from '@/app/NetWork/ContentNetwork';
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
  id: number;
}
const SingleDetail: React.FC<SingleDetailProps> = ({id}) => {
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedTab, setSelectedTab] = useState<'Episodes' | 'About'>('Episodes');
  const [singleInfo, setSingleInfo] = useState<ContentInfo>();

  useEffect(() => {
    const fetchContent = async (contentId: number) => {
      const payload: GetContentReq = {contentId};

      try {
        const response = await sendGetContent(payload);
        if (response.data) {
          console.log('콘텐츠 정보:', response.data.contentInfo);
          setSingleInfo(response.data.contentInfo);
        }
      } catch (error) {
        console.error('콘텐츠 조회 실패:', error);
      }
    };

    fetchContent(id);
  }, []);

  return (
    <div className={styles.container}>
      {/* 상단 배경 및 네비게이션 */}
      <div className={styles.header} style={{backgroundImage: `url(${singleInfo?.thumbnailUrl})`}}>
        <div className={styles.topNav}>
          <button className={styles.iconButton} onClick={() => {}}>
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
          <span className={styles.genres}>{singleInfo?.genre}</span>
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
                <div
                  className={styles.episodeThumbnail}
                  style={{backgroundImage: `url(${singleInfo?.thumbnailUrl})`}}
                ></div>
                <div className={styles.episodeInfo}>
                  <div className={styles.epTitleText}>{singleInfo?.name}</div>
                  {singleInfo?.categoryType == 1 && (
                    <div className={styles.epDuration}>{singleInfo?.contentVideoInfo?.videoSourcePlayTime}</div>
                  )}
                </div>
                <div className={styles.episodeActions}>
                  <button className={styles.iconButton}>
                    <img src={LineEdit.src} alt="Edit" className={styles.editIcon} />
                  </button>
                  <div className={styles.rating}>
                    <img src={BoldStar.src} className={styles.starIcon} />
                    {singleInfo?.categoryType == 0 && (
                      <span className={styles.rateText}>{singleInfo?.contentWebtoonInfo?.likeCount}</span>
                    )}
                    {singleInfo?.categoryType == 1 && (
                      <span className={styles.rateText}>{singleInfo?.contentVideoInfo?.likeCount}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={styles.episodeList}>{singleInfo?.description}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default SingleDetail;
