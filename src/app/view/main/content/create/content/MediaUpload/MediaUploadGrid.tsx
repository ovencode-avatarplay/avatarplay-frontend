import React from 'react';
import styles from './MediaUploadGrid.module.css';
import {CircleClose} from '@ui/Icons';

interface PostImageGridProps {
  imageUrls: string[]; // 이미지 URL 배열
  onRemove: (index: number) => void; // 이미지 삭제 함수
}

const PostImageGrid: React.FC<PostImageGridProps> = ({imageUrls, onRemove}) => {
  return (
    <div className={styles.gridContainer}>
      {imageUrls.map((url, index) => (
        <div key={index} className={styles.imageWrapper}>
          <img src={url} alt={`Uploaded ${index}`} className={styles.image} />
          <button className={styles.deleteButton} onClick={() => onRemove(index)}>
            <img src={CircleClose.src}></img>
          </button>
        </div>
      ))}
    </div>
  );
};

export default PostImageGrid;
