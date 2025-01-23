import React, {useEffect, useState} from 'react';
import {Box, Typography} from '@mui/material';
import styles from './SearchBoardHorizonScroll.module.css'; // 스타일 파일 임포트
import ExploreCard from './ExploreCard';

// Import Swiper React components
import {Swiper, SwiperSlide} from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

// Import required modules
import {ExploreCardProps} from './SearchBoardTypes';

interface Props {
  title: string;
  data: ExploreCardProps[];
}

const SearchBoardHorizonScroll: React.FC<Props> = ({title, data}) => {
  const [content, setContent] = useState<ExploreCardProps[]>([]);

  useEffect(() => {
    if (data) {
      const mappedData: ExploreCardProps[] = data.map(explore => ({
        exploreItemType: explore.exploreItemType,
        updateExplorState: explore.updateExplorState,
        contentId: explore.contentId,
        contentRank: explore.contentRank,
        contentName: explore.contentName,
        chatCount: explore.chatCount,
        episodeCount: explore.episodeCount,
        followerCount: explore.followerCount,
        thumbnail: explore.thumbnail,
      }));
      setContent(mappedData);
    }
  }, [data]);

  return (
    <section className={styles.containerBox}>
      <h2 className={styles.title}>{title}</h2>

      <Swiper slidesPerView={'auto'} spaceBetween={5} className={styles.exploreSwiper} grabCursor={true}>
        {content.map((explore, index) => (
          <SwiperSlide key={index}>
            <ExploreCard
              exploreItemType={explore.exploreItemType}
              updateExplorState={explore.updateExplorState}
              contentId={explore.contentId}
              contentRank={index + 1}
              contentName={explore.contentName}
              chatCount={explore.chatCount}
              episodeCount={explore.episodeCount}
              followerCount={explore.followerCount}
              thumbnail={explore.thumbnail}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default SearchBoardHorizonScroll;
