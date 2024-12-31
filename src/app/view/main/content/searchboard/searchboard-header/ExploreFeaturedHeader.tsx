import React from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import {Pagination} from 'swiper/modules';
import styles from './ExploreFeaturedHeader.module.css';

interface SwiperData {
  id: number;
  backgroundImage: string; // 배경 이미지 URL
  title: string;
  description: string;
}

interface ExploreFeaturedHeaderProps {
  items: SwiperData[];
}

const ExploreFeaturedHeader: React.FC<ExploreFeaturedHeaderProps> = ({items}) => {
  return (
    <div className={styles.swiperContainer}>
      <Swiper
        spaceBetween={'11px'} // 아이템 간격
        slidesPerView={1.08}
        centeredSlides={true}
        grabCursor={true}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination]}
      >
        {items.map(item => (
          <SwiperSlide key={item.id} className={styles.swiperItem}>
            <div className={styles.backImage} style={{backgroundImage: `url(${item.backgroundImage})`}}>
              <div className={styles.textArea}>
                <div className={`${styles.text} ${styles.type1}`}>{item.title}</div>
                <div className={`${styles.text} ${styles.type2}`}>{item.description}</div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ExploreFeaturedHeader;
