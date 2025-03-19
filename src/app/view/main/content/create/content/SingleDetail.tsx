import React, {useEffect, useState} from 'react';
import styles from './SingleDetail.module.css';
import {BoldArrowLeft, BoldShare, BoldLock, BoldHeart, BoldVideo, BoldStar, LineEdit, LinePlus} from '@ui/Icons';
import {
  ContentInfo,
  ContentListInfo,
  CreateContentReq,
  GetContentReq,
  sendGetContent,
} from '@/app/NetWork/ContentNetwork';
import {pushLocalizedRoute} from '@/utils/UrlMove';
import {useRouter} from 'next/navigation';
import SharePopup from '@/components/layout/shared/SharePopup';
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
  id: string;
}
const SingleDetail: React.FC<SingleDetailProps> = ({id}) => {
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedTab, setSelectedTab] = useState<'About'>('About');
  const [singleInfo, setSingleInfo] = useState<ContentInfo>();

  useEffect(() => {
    const fetchContent = async (urlLinkKey: string) => {
      const payload: GetContentReq = {urlLinkKey};

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

  const router = useRouter();
  const [isShare, setIsShare] = useState(false);
  const handleShare = async () => {
    const shareData = {
      title: '공유하기 제목',
      text: '이 링크를 확인해보세요!',
      url: window.location.href, // 현재 페이지 URL
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData); // 네이티브 공유 UI 호출
      } catch (error) {
        console.error('공유 실패:', error);
      }
    } else {
      setIsShare(true);
    }
  };
  const videoExtensions = ['mp4', 'webm', 'ogg']; // 비디오 확장자 목록
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp']; // 이미지 확장자 목록

  const getFileExtension = (url?: string) => url?.split('.').pop()?.toLowerCase() || '';

  const isVideo = (url?: string) => videoExtensions.includes(getFileExtension(url));
  const isImage = (url?: string) => imageExtensions.includes(getFileExtension(url));

  return (
    <div className={styles.container}>
      {/* 상단 배경 및 네비게이션 */}
      <div className={styles.header}>
        {isVideo(singleInfo?.thumbnailUrl) ? (
          <video className={styles.videoBackground} src={singleInfo?.thumbnailUrl} autoPlay loop muted playsInline />
        ) : (
          <div className={styles.imageBackground} style={{backgroundImage: `url(${singleInfo?.thumbnailUrl})`}} />
        )}

        {/* 기존 UI 요소들 */}
        <div className={styles.overlayContent}>
          <div className={styles.topNav}>
            <button
              className={styles.iconButton}
              onClick={() => {
                router.back();
              }}
            >
              <img src={BoldArrowLeft.src} alt="Back" />
            </button>
          </div>
        </div>
        <div className={styles.topNav}>
          <button
            className={styles.iconButton}
            onClick={() => {
              pushLocalizedRoute(`/create/content`, router);
            }}
          >
            <img src={BoldArrowLeft.src} alt="Back" />
          </button>
          {/* <button className={styles.iconButton}>
            <img src={LineEdit.src} alt="Edit" />
          </button> */}
        </div>
      </div>

      <div className={styles.contentContainer}>
        {/* 장르 및 공유 버튼 */}
        <div className={styles.genreShare}>
          <span className={styles.genres}>
            {[singleInfo?.genre, ...(singleInfo?.tags ?? [])].filter(Boolean).join(' / ')}
          </span>

          <button className={styles.iconButton} onClick={() => handleShare()}>
            <img src={BoldShare.src} alt="Share" />
          </button>
        </div>

        {/* 탭 메뉴 */}
        <div className={styles.tabs}>
          <div className={styles.tabContainer}>
            <button
              className={`${styles.tabButton} ${selectedTab === 'About' ? styles.activeTab : ''}`}
              onClick={() => setSelectedTab('About')}
            >
              About
            </button>
            {/* 이동하는 밑줄 */}
            <div className={styles.tabUnderline} style={{left: '0px'}} />
          </div>
        </div>
        <div className={styles.about}>{singleInfo?.description}</div>
      </div>

      <SharePopup
        open={isShare}
        title={'Share'}
        url={window.location.href}
        onClose={() => setIsShare(false)}
      ></SharePopup>
    </div>
  );
};

export default SingleDetail;
