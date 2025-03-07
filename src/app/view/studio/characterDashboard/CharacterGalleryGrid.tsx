import React from 'react';
import styles from './CharacterGalleryGrid.module.css';
import CharacterGalleryItem from './CharacterGalleryItem';
import EmptyState from '@/components/search/EmptyState';
import {GalleryCategory} from './CharacterGalleryData';
import {LinePlus} from '@ui/Icons';
import {GalleryImageInfo} from '@/app/NetWork/CharacterNetwork';

interface CharacterGalleryGridProps {
  itemUrl: GalleryImageInfo[] | null;
  selectedItemIndex: number | null;
  onSelectItem: (index: number | null) => void;
  onAddImageClick?: () => void;
  category: GalleryCategory;
  isTrigger?: boolean;
  style?: React.CSSProperties;
  hideSelected?: boolean;
}

const CharacterGalleryGrid: React.FC<CharacterGalleryGridProps> = ({
  itemUrl,
  selectedItemIndex,
  onSelectItem,
  onAddImageClick,
  category,
  isTrigger,
  style,
  hideSelected = false,
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
        <button onClick={onAddImageClick} className={styles.addImageButton}>
          <div className={styles.buttonArea}>
            <img className={styles.buttonIcon} src={LinePlus.src} />
            <div className={styles.buttonText}>Add New </div>
          </div>
        </button>
      )}
      {!isEmptyGallery &&
        itemUrl?.map((item, index) => (
          <CharacterGalleryItem
            key={index}
            url={item}
            isSelected={selectedItemIndex === index}
            onSelect={() => onSelectItem(index)}
            hideSelected={hideSelected}
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
