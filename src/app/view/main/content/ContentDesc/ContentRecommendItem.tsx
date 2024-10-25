import React from 'react';
import Style from './ContentRecommendItem.module.css'; // 스타일 파일 임포트

interface ContentRecommendItemProps {
  contentId: number;
  imageUrl: string;
  onSelect: (contentId: number) => void; // 부모 컴포넌트에 contentId 전달하는 핸들러
}

const ContentRecommendItem: React.FC<ContentRecommendItemProps> = ({contentId, imageUrl, onSelect}) => {
  return (
    <div className={Style.recommendItem} onClick={() => onSelect(contentId)}>
      <img src={imageUrl} alt={`Content ${contentId}`} className={Style.recommendImage} />
    </div>
  );
};

export default ContentRecommendItem;
