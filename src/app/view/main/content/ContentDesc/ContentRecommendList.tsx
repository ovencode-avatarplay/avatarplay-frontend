import React from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import ContentRecommendItem from './ContentRecommendItem';
import {recommendContentInfo} from '@/app/NetWork/ContentNetwork';

interface ContentRecommendListProps {
  recommendContents: recommendContentInfo[];
  onSelectContent: (contentId: number) => void; // 부모에 선택된 contentId 전달
}

const ContentRecommendList: React.FC<ContentRecommendListProps> = ({recommendContents, onSelectContent}) => {
  return (
    <Swiper
      spaceBetween={16}
      slidesPerView={2.5} // 한 번에 2.5개의 아이템 표시
      style={{width: '100%', height: 'auto'}}
    >
      {recommendContents.map(content => (
        <SwiperSlide key={content.contentId}>
          <ContentRecommendItem contentId={content.contentId} imageUrl={content.imageUrl} onSelect={onSelectContent} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ContentRecommendList;
