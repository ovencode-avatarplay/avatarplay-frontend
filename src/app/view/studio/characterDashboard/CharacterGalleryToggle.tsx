import React from 'react';
import styles from './CharacterGalleryToggle.module.css';
import {GalleryCategory} from './CharacterGalleryData';

interface CharacterGalleryToggleProps {
  category: GalleryCategory; // 현재 선택된 카테고리
  onCategoryChange: (category: GalleryCategory) => void; // 카테고리 변경 핸들러
}

const CharacterGalleryToggle: React.FC<CharacterGalleryToggleProps> = ({category, onCategoryChange}) => {
  return (
    <div className={styles.toggleButtons}>
      <button
        className={`${styles.toggleButton} ${category === GalleryCategory.All ? styles.active : ''}`}
        onClick={() => onCategoryChange(GalleryCategory.All)}
      >
        All
      </button>
      <button
        className={`${styles.toggleButton} ${category === GalleryCategory.Portrait ? styles.active : ''}`}
        onClick={() => onCategoryChange(GalleryCategory.Portrait)}
      >
        Portrait
      </button>
      <button
        className={`${styles.toggleButton} ${category === GalleryCategory.Pose ? styles.active : ''}`}
        onClick={() => onCategoryChange(GalleryCategory.Pose)}
      >
        Poses
      </button>
      <button
        className={`${styles.toggleButton} ${category === GalleryCategory.Expression ? styles.active : ''}`}
        onClick={() => onCategoryChange(GalleryCategory.Expression)}
      >
        Expression
      </button>
    </div>
  );
};

export default CharacterGalleryToggle;
