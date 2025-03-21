import React, {useEffect, useState} from 'react';
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
}

const SearchBoardHorizonScroll: React.FC<Props> = ({title, data}) => {
  return (
    <section className={styles.containerBox}>
      <h2 className={styles.title}>{title}</h2>

      <Swiper slidesPerView={'auto'} spaceBetween={5} className={styles.exploreSwiper} grabCursor={true}>
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
