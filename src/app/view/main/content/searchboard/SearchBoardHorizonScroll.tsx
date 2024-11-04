import React, {useEffect, useState} from 'react';
import {Box, Typography} from '@mui/material';
import Style from './SearchBoardHorizonScroll.module.css'; // 스타일 파일 임포트
import ExploreCard from './ExploreCard';
import {ExploreCardProps} from '@/types/apps/explore-card-type';

// Import Swiper React components
import {Swiper, SwiperSlide} from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

// Import required modules
import {FreeMode, Pagination} from 'swiper/modules';

interface Props {
  title: string;
  data: ExploreCardProps[];
}

const SearchBoardHorizonScroll: React.FC<Props> = ({title, data}) => {
  const [content, setContent] = useState<ExploreCardProps[]>([]);

  useEffect(() => {
    if (data) {
      const mappedData: ExploreCardProps[] = data.map(explore => ({
        contentId: explore.contentId,
        episodeId: explore.episodeId,
        thumbnail: explore.thumbnail,
      }));
      setContent(mappedData);
    }
  }, [data]);

  return (
    <Box className={Style.containerBox}>
      <Typography variant="h5" sx={{fontWeight: 'bold', marginBottom: '8px'}}>
        {title}
      </Typography>

      {/* Horizontal scrollable ExploreCard list */}
      <Swiper
        slidesPerView={3} // 한 번에 보이는 슬라이드 수
        freeMode={true} // 자유로운 스크롤
        // pagination={{
        //   clickable: true,
        // }}
        modules={[FreeMode, Pagination]}
        className={Style.mySwiper}
      >
        {content.map((explore, index) => (
          <SwiperSlide key={index} style={{width: 'auto'}}>
            {/* 각 슬라이드의 너비를 자동으로 설정 */}
            <ExploreCard contentId={explore.contentId} episodeId={explore.episodeId} thumbnail={explore.thumbnail} />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default SearchBoardHorizonScroll;
