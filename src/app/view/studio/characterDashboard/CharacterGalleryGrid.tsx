import React from 'react';
import {Button} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import styles from './CharacterGalleryGrid.module.css';
import CharacterGalleryItem from './CharacterGalleryItem';
import {GalleryImageInfo} from '@/redux-store/slices/EpisodeInfo';
import EmptyState from '@/components/search/EmptyState';
import {GalleryCategory} from './CharacterGalleryData';

interface CharacterGalleryGridProps {
  itemUrl: GalleryImageInfo[] | null;
  selectedItemIndex: number | null;
  onSelectItem: (index: number | null) => void;
  onAddImageClick?: () => void;
  category: GalleryCategory;
  isTrigger?: boolean;
  style?: React.CSSProperties;
}

const CharacterGalleryGrid: React.FC<CharacterGalleryGridProps> = ({
  itemUrl,
  selectedItemIndex,
  onSelectItem,
  onAddImageClick,
  category,
  isTrigger,
  style,
}) => {
  const isEmptyGallery = !itemUrl || itemUrl.length === 0;

  const getGetCategoryName = (category: GalleryCategory) => {
    let tmp = '';
    switch (category) {
      case GalleryCategory.All:
        tmp = 'All';
        break;
      case GalleryCategory.Portrait:
        tmp = 'Portrait';
        break;
      case GalleryCategory.Pose:
        tmp = 'Pose';
        break;
      case GalleryCategory.Expression:
        tmp = 'Expression';
        break;
    }
    return tmp;
  };

  return (
    <div className={styles.galleryContainer} style={style}>
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
        <div className={styles.emptyMessage}>
          <EmptyState
            stateText={
              <>
                It's pretty lonely out here.
                <br />
                Create {getGetCategoryName(category)}
              </>
            }
          />
        </div>
      )}
    </div>
  );
};

export default CharacterGalleryGrid;
