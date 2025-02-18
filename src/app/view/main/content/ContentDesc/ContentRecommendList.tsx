import React from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import ContentRecommendItem from './ContentRecommendItem';
import {recommendStoryInfo} from '@/app/NetWork/ContentNetwork';

interface ContentRecommendListProps {
  recommendContents: recommendStoryInfo[];
  onSelectContent: (contentId: number) => void; // 부모에 선택된 contentId 전달
}

const ContentRecommendList: React.FC<ContentRecommendListProps> = ({recommendContents, onSelectContent}) => {
  return (
    <>
      {recommendContents.map(content => (
        // <SwiperSlide key={content.contentId}>
        <ContentRecommendItem contentId={content.storyId} imageUrl={content.imageUrl} onSelect={onSelectContent} />
        // </SwiperSlide>
      ))}
    </>
  );
};

export default ContentRecommendList;
