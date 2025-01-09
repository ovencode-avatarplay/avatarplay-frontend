import React from 'react';
import styles from './UploadedImageArea.module.css';
import {BoldCircleX} from '@ui/Icons';

interface Props {
  imgUrl: string;
  onDelete: () => void;
}

const UploadedImageArea: React.FC<Props> = ({imgUrl, onDelete}) => {
  return (
    <div className={styles.uploadedImageArea}>
      <div
        className={styles.uploadedImage}
        style={{
          backgroundImage: `url(${imgUrl})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
        }}
        role="img"
        aria-label="Uploaded"
      />
      <button className={styles.deleteButton} onClick={onDelete}>
        <img src={BoldCircleX.src} className={styles.buttonIcon} alt="Delete Icon" />
      </button>
    </div>
  );
};

export default UploadedImageArea;
