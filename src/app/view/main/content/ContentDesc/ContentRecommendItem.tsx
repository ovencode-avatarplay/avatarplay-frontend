import React from 'react';
import styles from './ContentRecommendItem.module.css';

interface ContentRecommendItemProps {
  contentId: number;
  imageUrl: string;
  onSelect: (contentId: number) => void;
}

const ContentRecommendItem: React.FC<ContentRecommendItemProps> = ({contentId, imageUrl, onSelect}) => {
  return (
    <div className={styles.recommendItem} onClick={() => onSelect(contentId)}>
      <img src={imageUrl} alt={`Content ${contentId}`} className={styles.recommendImage} />
    </div>
  );
};

export default ContentRecommendItem;
