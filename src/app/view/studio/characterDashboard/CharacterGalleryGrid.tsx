import React from 'react';
import {Box, Button, Typography} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import styles from './CharacterGalleryGrid.module.css';
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
    <div className={styles.galleryContainer}>
      {!isTrigger && (
        <Button variant="contained" color="primary" onClick={onAddImageClick} className={styles.addImageButton}>
          <AddIcon />
          Add Image
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
    </div>
  );
};

export default CharacterGalleryGrid;
