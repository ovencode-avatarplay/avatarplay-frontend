import React from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import {Pagination} from 'swiper/modules';
import styles from './ExploreFeaturedHeader.module.css';
import {BannerUrlList} from '@/app/NetWork/ExploreNetwork';
import Link from 'next/link';
import {getLocalizedLink} from '@/utils/UrlMove';

interface ExploreFeaturedHeaderProps {
  items: BannerUrlList[];
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
            <Link key={index} href={item.imageLinkUrl}>
              <div
                className={styles.backImage}
                style={{
                  background: `url(${item.imageUrl}) `,
                  backgroundPosition: 'center',
                  // backgroundSize: '100% auto',
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
    </div>
  );
};

export default ExploreFeaturedHeader;
