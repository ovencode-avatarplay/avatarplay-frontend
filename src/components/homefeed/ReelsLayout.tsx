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

  const fetchRecommendFeed = async () => {
    const result = await sendGetRecommendFeed({language: navigator.language || 'en-US'});
    if (result.resultCode === 0 && result.data) {
      const feeds = result.data.feedInfoList;
      if (initialFeed) {
        // 초기 피드를 배열의 첫 번째로 추가
        setInfo([initialFeed, ...feeds]);
      } else {
        setInfo(feeds);
      }
      console.log(feeds);
    }
  };

  useEffect(() => {
    fetchRecommendFeed();
  }, [initialFeed]);

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
    const currentIndex = swiper.activeIndex; // 현재 슬라이드 인덱스
    setCurrentSlideIndex(currentIndex); // 활성화된 슬라이드 인덱스 업데이트

    const currentItem = info[currentIndex]; // 현재 슬라이드의 아이템
    console.log('currentIndex', currentIndex);
    console.log('currentItem', currentItem);

    if (currentItem) {
      viewFeed(currentItem.id); // 현재 슬라이드 아이템 조회

      // URL 업데이트 (주소창만 변경, 새로고침 없음)
      const newUrl = `/ko/main/homefeed/${currentItem.urlLinkKey}`;
      window.history.pushState(null, '', newUrl); // 새 주소로 변경
    }
  };

  return (
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
  );
};

export default ReelsLayout;
