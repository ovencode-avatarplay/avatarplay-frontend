import React, {useState} from 'react';
import styles from './SearchBoardHorizonScroll.module.css'; // 스타일 파일 임포트
import ExploreCard from './ExploreCard';

// Import Swiper React components
import {Swiper, SwiperSlide} from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import {ExploreItem} from '@/app/NetWork/ExploreNetwork';

// Import required modules

interface Props {
  title: string;
  data: ExploreItem[];
  requestMoreData?: () => void;
}

const SearchBoardHorizonScroll: React.FC<Props> = ({title, data, requestMoreData}) => {
  const handleSlideChange = (swiper: any) => {
    if (!requestMoreData) return;

    const currentIndex = swiper.activeIndex;
    const totalSlides = swiper.slides.length;

    // 한 화면에 보여질 수 있는 슬라이드 수 계산 (각 슬라이드가 113px 일 때)
    const visibleSlides = Math.floor(swiper.width / 113);

    if (currentIndex + visibleSlides >= totalSlides - 4) {
      requestMoreData();
    }
  };

  return (
    <section className={styles.containerBox}>
      <h2 className={styles.title}>{title}</h2>

      <Swiper
        slidesPerView={'auto'}
        spaceBetween={5}
        className={styles.exploreSwiper}
        grabCursor={true}
        onSlideChange={handleSlideChange}
      >
        {data.map((explore, index) => (
          <SwiperSlide key={index}>
            <ExploreCard explore={explore} index={index} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default SearchBoardHorizonScroll;
