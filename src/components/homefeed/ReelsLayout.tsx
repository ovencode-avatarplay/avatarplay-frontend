'use client';

import React, {useState, useEffect} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/scrollbar';
import ReelsContent from './ReelsContent';
import {FeedInfo, sendFeedView, sendGetRecommendFeed} from '@/app/NetWork/ShortsNetwork';
import styles from './ReelsLayout.module.css';

interface ReelsLayoutProps {
  initialFeed?: FeedInfo; // 특정 URL 키를 통해 전달받은 초기 피드
}

const ReelsLayout: React.FC<ReelsLayoutProps> = ({initialFeed}) => {
  const [info, setInfo] = useState<FeedInfo[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0); // 현재 활성 슬라이드 인덱스
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

  const getEmailFromJwt = (): string | null => {
    const jwt = localStorage.getItem('jwt'); // localStorage에서 JWT 가져오기
    if (jwt) {
      const payload = decodeJwt(jwt); // 디코드
      return payload?.email || null; // email 반환
    }
    return null; // JWT가 없을 경우 null 반환
  };

  const fetchRecommendFeed = async () => {
    const result = await sendGetRecommendFeed({language: navigator.language || 'en-US'});
    if (result.resultCode === 0 && result.data) {
      const feeds = result.data.feedInfoList;
      if (initialFeed) {
        // 초기 피드를 배열의 첫 번째로 추가
        setInfo([initialFeed, ...feeds]);
        console.log('initialFeed', initialFeed);
      } else {
        setInfo(feeds);
      }
    }
  };

  useEffect(() => {
    fetchRecommendFeed();
  }, [initialFeed, getEmailFromJwt()]);

  useEffect(() => {
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

  // 슬라이드 변경 이벤트 핸들러
  const handleSlideChange = (swiper: any) => {
    const currentIndex = swiper.activeIndex;
    setCurrentSlideIndex(currentIndex);
    // 배열 범위 검증
    if (currentIndex < 0 || currentIndex >= info.length) {
      console.warn('Slide index out of bounds');
      return;
    }

    const currentItem = info[currentIndex];

    if (currentItem && currentItem.urlLinkKey != null) {
      viewFeed(currentItem.id);

      // URL 업데이트
      const newUrl = `/ko/main/homefeed/${currentItem.urlLinkKey}`;
      window.history.pushState(null, '', newUrl);
    } else {
      console.warn('Invalid urlLinkKey for current slide');
    }
  };

  return (
    <>
      {/* <Head>
        <title>{initialFeed?.characterProfileName || 'Home Feed'}</title>
        <meta name="description" content={initialFeed?.description || 'Welcome to the home feed'} />
        <meta property="og:title" content={initialFeed?.characterProfileName || 'Home Feed'} />
        <meta property="og:description" content={initialFeed?.description || ''} />
        <meta property="og:image" content={initialFeed?.characterProfileUrl || '/default-image.png'} />
      </Head> 추후 메타 처리*/}
      <Swiper
        direction="vertical"
        spaceBetween={0}
        slidesPerView={1}
        centeredSlides={true}
        scrollbar={{draggable: true}}
        onSlideChange={handleSlideChange}
        className={styles.mySwiper}
      >
        {info.map((item, index) => (
          <SwiperSlide key={index} className={styles.swiperSlide}>
            <ReelsContent item={item} isActive={index === currentSlideIndex} />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default ReelsLayout;
