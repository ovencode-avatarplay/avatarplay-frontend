import React, {useEffect, useState} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import {Pagination} from 'swiper/modules';
import styles from './ExploreFeaturedHeader.module.css';
import {BannerUrlList} from '@/app/NetWork/ExploreNetwork';
import Link from 'next/link';

interface ExploreFeaturedHeaderProps {
  items: BannerUrlList[];
}

const ExploreFeaturedHeader: React.FC<ExploreFeaturedHeaderProps> = ({items}) => {
  const [gap, setGap] = useState(13); // 기본값 (1300px * 1%)

  useEffect(() => {
    const updateGap = () => {
      const containerWidth = window.innerWidth;
      const newGap = containerWidth * 0.01; // 1% 계산
      setGap(newGap);
    };

    updateGap(); // 최초 실행
    window.addEventListener('resize', updateGap); // 리사이즈 대응

    return () => window.removeEventListener('resize', updateGap);
  }, []);

  useEffect(() => {
    const paginationElement = document.querySelector(`.${styles.customPagination}`);
    if (paginationElement) {
      paginationElement.classList.add('swiper-pagination');
    }
  }, []);

  return (
    <div className={styles.swiperContainer}>
      <Swiper
        spaceBetween={gap}
        slidesPerView={'auto'}
        loop={true}
        centeredSlides={true}
        grabCursor={true}
        pagination={{
          el: `.${styles.customPagination}`,
          clickable: true,
          renderBullet: (index, className) =>
            `<span class="${className} ${styles.paginationBullet} ${index > -1 ? styles.selected : ''}"></span>`,
        }}
        modules={[Pagination]}
        style={{width: '100%'}}
      >
        {items.map((item, index) => (
          <SwiperSlide className={styles.swiperItem} key={index}>
            <Link className={styles.link} href={item.imageLinkUrl}>
              <div
                className={styles.backImage}
                style={{
                  backgroundImage: `url(${item.imageUrl})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                <div className={styles.textArea}>
                  <div className={`${styles.text} ${styles.type1}`}>{item.title}</div>
                  <div className={`${styles.text} ${styles.type2}`}>{item.content}</div>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className={`${styles.customPagination} swiper-pagination`}></div>
    </div>
  );
};

export default ExploreFeaturedHeader;
