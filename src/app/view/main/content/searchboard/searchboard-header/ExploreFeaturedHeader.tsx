import React from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import {Pagination} from 'swiper/modules';
import styles from './ExploreFeaturedHeader.module.css';

interface ExploreFeaturedHeaderProps {
  items: string[];
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
          renderBullet: (index, className) =>
            `<span class="${className}" style="background-color: ${index > -1 ? 'white' : ''};"></span>`,
        }}
        modules={[Pagination]}
      >
        {items.map((item, index) => (
          <SwiperSlide className={styles.swiperItem} key={index}>
            <div className={styles.backImage} style={{backgroundImage: `url(${item})`}}>
              <div className={styles.textArea}>
                <div className={`${styles.text} ${styles.type1}`}>title</div>
                <div className={`${styles.text} ${styles.type2}`}>description</div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ExploreFeaturedHeader;
