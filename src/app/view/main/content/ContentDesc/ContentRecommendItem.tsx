import React from 'react';
import Style from './ContentRecommendItem.module.css';

interface ContentRecommendItemProps {
  contentId: number;
  imageUrl: string;
  onSelect: (contentId: number) => void;
}

const ContentRecommendItem: React.FC<ContentRecommendItemProps> = ({contentId, imageUrl, onSelect}) => {
  return (
    <div className={Style.recommendItem} onClick={() => onSelect(contentId)}>
      <img src={imageUrl} alt={`Content ${contentId}`} className={Style.recommendImage} />
    </div>
  );
};

export default ContentRecommendItem;
