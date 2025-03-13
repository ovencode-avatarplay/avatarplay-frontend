import React, {useEffect} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import {Pagination} from 'swiper/modules';
import styles from './ExploreFeaturedHeader.module.css';
import {BannerUrlList} from '@/app/NetWork/ExploreNetwork';
import Link from 'next/link';

interface ExploreFeaturedHeaderProps {
  items: BannerUrlList[];
}

const ExploreFeaturedHeader: React.FC<ExploreFeaturedHeaderProps> = ({items}) => {
  useEffect(() => {
    const paginationElement = document.querySelector(`.${styles.customPagination}`);
    if (paginationElement) {
      paginationElement.classList.add('swiper-pagination'); // Swiper가 인식하도록 클래스 추가
    }
  }, []);

  return (
    <div className={styles.swiperContainer}>
      <Swiper
        spaceBetween={'11px'} // 아이템 간격
        slidesPerView={1.08}
        centeredSlides={true}
        grabCursor={true}
        pagination={{
          el: `.${styles.customPagination}`,
          clickable: true,
          renderBullet: (index, className) =>
            `<span class="${className} ${styles.paginationBullet} ${index > -1 ? styles.selected : ''}"></span>`,
        }}
        modules={[Pagination]}
      >
        {items.map((item, index) => (
          <SwiperSlide className={styles.swiperItem} key={index}>
            <Link className={styles.link} key={index} href={item.imageLinkUrl}>
              <div
                className={styles.backImage}
                style={{
                  background: `url(${item.imageUrl}) `,
                  backgroundPosition: 'center',
                  backgroundSize: '100% cover',
                  backgroundRepeat: 'no-repeat',
                  backgroundAttachment: 'fixed',
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
