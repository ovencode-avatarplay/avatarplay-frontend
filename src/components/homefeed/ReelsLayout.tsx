'use client';

import React, {useState, useEffect} from 'react';
import {Box} from '@mui/material';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css'; // Swiper 기본 스타일
import 'swiper/css/scrollbar'; // Swiper 스크롤바 스타일 (선택사항)
import ReelsContent from './ReelsContent';
import {FeedInfo, sendGetRecommendFeed} from '@/app/NetWork/ShortsNetwork';
import styles from './ReelsLayout.module.css';

const ReelsLayout = () => {
  const [info, setInfo] = useState<FeedInfo[]>([]);

  const fetchRecommendFeed = async () => {
    const result = await sendGetRecommendFeed();
    if (result.resultCode === 0 && result.data) {
      setInfo(result.data as FeedInfo[]);
      console.log('Recommended feeds fetched successfully:', result.data);
    } else {
      console.error('Failed to fetch recommended feeds:', result.resultMessage);
    }
  };

  useEffect(() => {
    fetchRecommendFeed();
  }, []);

  return (
    <Swiper
      direction="vertical" // 세로 방향 설정
      spaceBetween={0} // 슬라이드 간격
      slidesPerView={1} // 한 번에 하나의 슬라이드 표시
      centeredSlides={true} // 슬라이드를 중앙 정렬
      scrollbar={{draggable: true}} // 스크롤바 활성화 (선택사항)
      className={styles.mySwiper}
    >
      {info.map((item, index) => (
        <SwiperSlide key={index} className={styles.swiperSlide}>
          <ReelsContent item={item} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ReelsLayout;
