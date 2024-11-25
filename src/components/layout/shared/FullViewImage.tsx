import React from 'react';
import styles from './FullViewImage.module.css';
import {Box} from '@mui/material';

export interface FullViewImageData {
  url: string;
  parameter: string;
}

export interface FullViewImageProps {
  imageData: FullViewImageData;
  onClick: () => void;
}

const FullViewImage: React.FC<FullViewImageProps> = ({imageData, onClick}) => {
  return (
    <Box className={styles.fullscreenOverlay} onClick={onClick}>
      {/* Fullscreen image */}
      <Box
        className={styles.fullscreenImage}
        sx={{
          backgroundImage: `url(${imageData.url})`,
        }}
      />
      <Box
        className={styles.textBox}
        onClick={e => {
          e.stopPropagation();
          navigator.clipboard.writeText(imageData.parameter);
          alert('Copied to clipboard!');
        }}
      >
        {imageData.parameter}
      </Box>
    </Box>
  );
};

export default FullViewImage;
