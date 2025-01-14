'use client';

import React, {useState, useEffect} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/scrollbar';
import ReelsContent from './ReelsContent';
import {FeedInfo, sendFeedView, sendGetRecommendFeed} from '@/app/NetWork/ShortsNetwork';
import styles from './ReelsLayout.module.css';

const ReelsLayout = () => {
  const [info, setInfo] = useState<FeedInfo[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0); // 현재 활성 슬라이드 인덱스

  // 추천 피드 데이터를 가져오는 함수
  const fetchRecommendFeed = async () => {
    const result = await sendGetRecommendFeed({language: navigator.language || 'en-US'});
    if (result.resultCode === 0 && result.data) {
      setInfo(result.data.feedInfoList);
      console.log('Recommended feeds fetched successfully:', result.data);
    } else {
      console.error('Failed to fetch recommended feeds:', result.resultMessage);
    }
  };

  // 피드 조회 API 호출
  const viewFeed = async (feedId: number) => {
    try {
      const response = await sendFeedView(feedId);
      if (response.resultCode === 0 && response.data) {
        console.log('Feed viewed successfully:', response.data);
      } else {
        console.error('Failed to view feed:', response.resultMessage);
      }
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
    }
  };

  useEffect(() => {
    fetchRecommendFeed();
  }, []);

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
