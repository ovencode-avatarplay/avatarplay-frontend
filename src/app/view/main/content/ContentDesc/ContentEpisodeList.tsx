import React from 'react';
import {Box, Typography} from '@mui/material';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Pagination} from 'swiper/modules';
import Style from './DrawerContentDesc.module.css';
import 'swiper/css';
import 'swiper/css/pagination';

import ContentEpisodeItem from './ContentEpisodeItem'; // 아이템 컴포넌트 임포트
import {EpisodeCardProps} from '@/types/apps/episode-card-type';

interface DrawerContentEpisodeItemListProps {
  episodes: EpisodeCardProps[];
  onEpisodeSelect: (index: number) => void;
}

const DrawerContentEpisodeItemList: React.FC<DrawerContentEpisodeItemListProps> = ({episodes, onEpisodeSelect}) => {
  return (
    <Box className={Style.episodeInfoList}>
      <Swiper modules={[Pagination]} pagination={{clickable: true}} spaceBetween={'20px'} slidesPerView={1}>
        {episodes.map((episode, index) => (
          <SwiperSlide key={episode.episodeId} onClick={() => onEpisodeSelect(index)}>
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
