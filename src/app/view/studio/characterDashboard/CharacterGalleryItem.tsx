import React from 'react';
import {Box} from '@mui/material';
import styles from './CharacterGalleryItem.module.css';

interface CharacterGalleryItemProps {
  url: string;
  isSelected: boolean;
  onSelect: () => void;
}

const CharacterGalleryItem: React.FC<CharacterGalleryItemProps> = ({url, isSelected, onSelect}) => {
  return (
    <Box
      onClick={onSelect}
      className={`${styles.galleryItem} ${isSelected ? styles.selected : ''}`}
      sx={{
        backgroundImage: `url(${url})`,
      }}
    />
  );
};

export default CharacterGalleryItem;
