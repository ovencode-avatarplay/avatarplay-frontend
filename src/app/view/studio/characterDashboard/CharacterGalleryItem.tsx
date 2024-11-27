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
    <Box
      onClick={onSelect}
      className={`${styles.galleryItem} ${isSelected ? styles.selected : ''}`}
      sx={{
        backgroundImage: `url(${url.imageUrl})`,
        borderRadius: '8px',
      }}
    />
  );
};

export default CharacterGalleryItem;
