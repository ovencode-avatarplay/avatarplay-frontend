import React from 'react';
import styles from './CharacterGalleryItem.module.css';
import {LineCheck} from '@ui/Icons';
import {GalleryImageInfo} from '@/redux-store/slices/ContentInfo';

interface CharacterGalleryItemProps {
  url: GalleryImageInfo;
  isSelected: boolean;
  onSelect: () => void;
}

const CharacterGalleryItem: React.FC<CharacterGalleryItemProps> = ({url, isSelected, onSelect}) => {
  return (
    <div
      onClick={onSelect}
      className={`${styles.galleryItem} ${isSelected ? styles.selected : ''}`}
      style={{
        background: isSelected
          ? `linear-gradient(0deg, rgba(0, 0, 0, 0.50) 0%, rgba(0, 0, 0, 0.50) 100%), url(${url.imageUrl}) lightgray 50% / cover no-repeat`
          : `url(${url.imageUrl}) lightgray 50% / cover no-repeat`,
      }}
    >
      {isSelected && <img src={LineCheck.src} className={styles.selectedIcon} />}
    </div>
  );
};

export default CharacterGalleryItem;
