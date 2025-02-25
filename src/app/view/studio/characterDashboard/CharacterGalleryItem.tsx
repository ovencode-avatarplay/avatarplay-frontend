import React from 'react';
import styles from './CharacterGalleryItem.module.css';
import {LineCheck} from '@ui/Icons';
import {GalleryImageInfo} from '@/redux-store/slices/StoryInfo';

interface CharacterGalleryItemProps {
  url: GalleryImageInfo;
  isSelected: boolean;
  onSelect: () => void;
  hideSelected?: boolean;
}

const CharacterGalleryItem: React.FC<CharacterGalleryItemProps> = ({
  url,
  isSelected,
  onSelect,
  hideSelected = false,
}) => {
  return (
    <div
      onClick={onSelect}
      className={`${styles.galleryItem} ${isSelected ? styles.selected : ''}`}
      style={{
        background:
          isSelected && !hideSelected
            ? `linear-gradient(0deg, rgba(0, 0, 0, 0.50) 0%, rgba(0, 0, 0, 0.50) 100%), url(${url.imageUrl}) lightgray 50% / cover no-repeat`
            : `url(${url.imageUrl}) lightgray 50% / cover no-repeat`,
      }}
    >
      {isSelected && !hideSelected && <img src={LineCheck.src} className={styles.selectedIcon} />}
    </div>
  );
};

export default CharacterGalleryItem;
