import React from 'react';
import {Box} from '@mui/material';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Pagination} from 'swiper/modules';
import styles from './DrawerContentDesc.module.css';
import 'swiper/css';
import 'swiper/css/pagination';

import ContentEpisodeItem from './ContentEpisodeItem'; // 아이템 컴포넌트 임포트
import {EpisodeCardProps} from './ContentDescType';

interface DrawerContentEpisodeItemListProps {
  episodes: EpisodeCardProps[];
  onEpisodeSelect: (index: number) => void;
}

const DrawerContentEpisodeItemList: React.FC<DrawerContentEpisodeItemListProps> = ({episodes, onEpisodeSelect}) => {
  const handleSlideChange = (swiper: any) => {
    const activeIndex = swiper.activeIndex; // 현재 선택된 슬라이드의 인덱스를 가져옵니다.
    onEpisodeSelect(activeIndex); // 선택된 인덱스를 onEpisodeSelect 함수에 전달합니다.
  };

  return (
    <Box className={styles.episodeInfoList}>
      <Swiper
        modules={[Pagination]}
        pagination={{clickable: true}}
        spaceBetween={'20px'}
        slidesPerView={1}
        onSlideChange={handleSlideChange} // 슬라이드 변경 시 handleSlideChange를 호출합니다.
      >
        {episodes.map((episode, index) => (
          <SwiperSlide key={episode.episodeId}>
            <ContentEpisodeItem
              episodeId={episode.episodeId}
              name={episode.name}
              desc={episode.desc}
              thumbnail={episode.thumbnail}
              intimacy={episode.intimacy}
              isLock={episode.isLock}
              imageCount={episode.imageCount}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default DrawerContentEpisodeItemList;
