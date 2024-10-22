import React from 'react';
import {Box, Typography} from '@mui/material';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Pagination} from 'swiper/modules';
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
    <Box className="episode-list">
      <Typography>에피소드 리스트 (가로 스크롤)</Typography>
      <Swiper modules={[Pagination]} pagination={{clickable: true}} spaceBetween={16} slidesPerView={1}>
        {episodes.map((episode, index) => (
          <SwiperSlide key={episode.episodeId} onClick={() => onEpisodeSelect(index)}>
            <ContentEpisodeItem
              episodeId={episode.episodeId}
              name={episodes[0].name}
              intimacy={11}
              imageCount={22}
              thumbnail={episode.thumbnail}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default DrawerContentEpisodeItemList;
