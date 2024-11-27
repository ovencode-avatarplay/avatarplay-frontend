import React, {useEffect} from 'react';
import {Box, Button, Typography} from '@mui/material';
import styles from './CharacterGallery.module.css';
import CharacterGalleryItem from './CharacterGalleryItem';
import {GalleryImageInfo} from '@/redux-store/slices/EpisodeInfo';

interface CharacterGalleryGridProps {
  itemUrl: GalleryImageInfo[] | null;
  selectedItemIndex: number | null;
  onSelectItem: (index: number | null) => void;
  onAddImageClick?: () => void;
  isTrigger?: boolean;
}

const CharacterGalleryGrid: React.FC<CharacterGalleryGridProps> = ({
  itemUrl,
  selectedItemIndex,
  onSelectItem,
  onAddImageClick,
  isTrigger,
}) => {
  const isEmptyGallery = !itemUrl || itemUrl.length === 0;

  return (
    <Box className={styles.galleryContainer}>
      {!isTrigger && (
        <Button variant="contained" color="primary" onClick={onAddImageClick} className={styles.addImageButton}>
          + Add Image
        </Button>
      )}
      {!isEmptyGallery &&
        itemUrl?.map((item, index) => (
          <CharacterGalleryItem
            key={index}
            url={item}
            isSelected={selectedItemIndex === index}
            onSelect={() => onSelectItem(index)}
          />
        ))}
      {isTrigger && isEmptyGallery && (
        <Typography variant="body1" className={styles.emptyMessage}>
          The gallery is empty.
        </Typography>
      )}
    </Box>
  );
};

export default CharacterGalleryGrid;
