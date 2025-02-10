'use client';

import React, {useState, useEffect, useRef} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/scrollbar';
import ReelsContent from './ReelsContent';
import {FeedInfo, sendFeedView, sendGetRecommendFeed} from '@/app/NetWork/ShortsNetwork';
import styles from './ReelsLayout.module.css';
import {setBottomNavColor} from '@/redux-store/slices/MainControl';
import {useDispatch} from 'react-redux';
import {LineArrowDown, LineFeatured} from '@ui/Icons';
import {getCurrentLanguage} from '@/utils/UrlMove';

interface ReelsLayoutProps {
  initialFeed?: FeedInfo; // 특정 URL 키를 통해 전달받은 초기 피드
}

const ReelsLayout: React.FC<ReelsLayoutProps> = ({initialFeed}) => {
  const [allFeeds, setAllFeeds] = useState<FeedInfo[]>([]); // 전체 데이터 저장
  const [info, setInfo] = useState<FeedInfo[]>([]); // 현재 렌더링된 데이터
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0); // 현재 슬라이드 인덱스
  const [isMute, setIsMute] = useState(true); // 현재 슬라이드 인덱스
  const containerRef = useRef<HTMLDivElement>(null);

  const decodeJwt = (token: string): {id?: string; email?: string; [key: string]: any} | null => {
    try {
      const base64Payload = token.split('.')[1]; // payload 부분 추출
      const decodedPayload = atob(base64Payload); // Base64 디코드
      return JSON.parse(decodedPayload); // JSON 파싱하여 반환
    } catch (error) {
      console.error('Failed to decode JWT:', error);
      return null;
    }
  };
  const dispatch = useDispatch();
  const getEmailFromJwt = (): string | null => {
    const jwt = localStorage.getItem('jwt'); // localStorage에서 JWT 가져오기
    if (jwt) {
      const payload = decodeJwt(jwt); // 디코드
      return payload?.email || null; // email 반환
    }
    return null; // JWT가 없을 경우 null 반환
  };

  // API 호출
  const fetchRecommendFeed = async () => {
    dispatch(setBottomNavColor(0));
    try {
      const lang = getCurrentLanguage();
      const result = await sendGetRecommendFeed({language: lang});

      if (result.resultCode === 0 && result.data) {
        const feeds = result.data.feedInfoList;

        // initialFeed가 있다면 feeds 배열 앞에 추가
        const mergedFeeds = initialFeed ? [initialFeed, ...feeds.filter(feed => feed.id !== initialFeed.id)] : feeds;

        setAllFeeds(mergedFeeds); // 전체 데이터 저장
        setInfo(mergedFeeds.slice(0, 2)); // 초기 렌더링용 첫 2개
      }
    } catch (error) {
      console.error('Failed to fetch recommended feed:', error);
    }
  };

  useEffect(() => {
    fetchRecommendFeed();
  }, [initialFeed, getEmailFromJwt()]);

  useEffect(() => {
    console.log('info', info);
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname; // 현재 경로
      const basePath = '/ko/main/homefeed'; // 동적 라우팅이 없는 기본 경로

      // 현재 경로가 basePath와 같다면 URL에 첫 번째 피드의 urlLinkKey 추가
      if (currentPath === basePath && info.length > 0) {
        const firstFeed = info[0];
        const newUrl = `${basePath}/${firstFeed.urlLinkKey}`;
        window.history.replaceState(null, '', newUrl); // 주소창만 변경 (새로고침 없음)
      }
    }
  }, [info]);

  // 피드 조회 API 호출
  const viewFeed = async (feedId: number) => {
    try {
      const response = await sendFeedView(feedId);
    } catch (error) {
      console.error('Error while viewing feed:', error);
    }
  };

  const handleScroll = () => {
    const sectionHeight = window.innerHeight;
    const scrollPosition = window.scrollY;
    const newIndex = Math.round(scrollPosition / sectionHeight);

    if (newIndex < 0 || newIndex >= allFeeds.length) return;

    if (newIndex !== currentSlideIndex) {
      setCurrentSlideIndex(newIndex);
      const currentItem = allFeeds[newIndex];

      if (currentItem && currentItem.urlLinkKey) {
        // ✅ 현재 URL과 다를 때만 변경하여 불필요한 pushState 방지
        const newUrl = `/ko/main/homefeed/${currentItem.urlLinkKey}`;
        if (window.location.pathname !== newUrl) {
          window.history.pushState(null, '', newUrl);
        }

        // ✅ API 호출도 꼭 필요할 때만 실행
        viewFeed(currentItem.id);
      }

      // ✅ 다음 데이터를 미리 로드하는 로직 유지
      if (newIndex >= info.length - 1 && info.length < allFeeds.length) {
        const nextItems = allFeeds.slice(info.length, info.length + 2);
        setInfo(prev => [...prev, ...nextItems]);
      }
    }
  };

  const [curFollowFeatured, setCurFollowFeatured] = useState(false); // 비디오 총 길이
  const [isOpenFollowFeatured, setIsOpenFollowFeatured] = useState(false); // 비디오 총 길이
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [allFeeds, currentSlideIndex]);
  React.useEffect(() => {
    console.log(isMute);
  }, [isMute]);

  return (
    <div ref={containerRef} className={styles.reelsContainer}>
      {/* <Head>
        <title>{initialFeed?.characterProfileName || 'Home Feed'}</title>
        <meta name="description" content={initialFeed?.description || 'Welcome to the home feed'} />
        <meta property="og:title" content={initialFeed?.characterProfileName || 'Home Feed'} />
        <meta property="og:description" content={initialFeed?.description || ''} />
        <meta property="og:image" content={initialFeed?.characterProfileUrl || '/default-image.png'} />
      </Head> 추후 메타 처리*/}

      <div className={styles.followingContainer}>
        <div className={styles.followingBox}>
          <span className={styles.followingText}>
            {curFollowFeatured && <>Featured</>}
            {!curFollowFeatured && <>Following</>}
          </span>
          <div
            className={styles.iconArrowDown}
            onClick={() => {
              setIsOpenFollowFeatured(!isOpenFollowFeatured);
            }}
          >
            <img src={LineArrowDown.src}></img>
          </div>
        </div>
      </div>

      {isOpenFollowFeatured && (
        <div
          className={styles.featuredContainer}
          onClick={() => {
            setCurFollowFeatured(!curFollowFeatured);
          }}
        >
          <span className={styles.featuredText}>
            {' '}
            {curFollowFeatured && <>Following</>}
            {!curFollowFeatured && <>Featured</>}
          </span>
          <div className={styles.featuredIcon}>
            <div className={styles.iconCircle}>
              <img src={LineFeatured.src}></img>
            </div>
          </div>
        </div>
      )}
      <div className={styles.reelsWrapper}>
        {info.map((item, index) => (
          <div key={index} className={styles.reelSlide}>
            <ReelsContent item={item} isActive={index === currentSlideIndex} isMute={isMute} setIsMute={setIsMute} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReelsLayout;
