import React from 'react';
import {Box} from '@mui/material';
import styles from './CharacterGalleryItem.module.css';
import {GalleryImageInfo} from '@/redux-store/slices/EpisodeInfo';

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
      style={{backgroundImage: `url(${url.imageUrl}`}}
    />
  );
};

export default CharacterGalleryItem;
