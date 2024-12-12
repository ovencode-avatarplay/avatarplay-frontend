import React from 'react';
import styles from './ImageGrid.module.css';
import {Box} from '@mui/material';

type ImageGridProps = {
  urls: string[]; // 이미지 URL 배열
};

const ImageGrid: React.FC<ImageGridProps> = ({urls}) => {
  const renderImages = () => {
    switch (urls.length) {
      case 1:
        return (
          <Box className={styles.count1}>
            <img src={urls[0]} className={styles.image} />
          </Box>
        );

      case 2:
        return (
          <div className={styles.count2}>
            <img src={urls[0]} className={styles.image} />
            <img src={urls[1]} className={styles.image} />
          </div>
        );
      case 3:
        return (
          <div className={styles.count3}>
            <img src={urls[0]} className={styles.image} />
            <img src={urls[1]} className={styles.image} />
            <img src={urls[2]} className={styles.image} />
          </div>
        );
      case 4:
        return (
          <div className={styles.count4}>
            <div className={styles.row4}>
              <img src={urls[0]} className={styles.image4} />
              <img src={urls[1]} className={styles.image4} />
            </div>
            <div className={styles.row4}>
              <img src={urls[2]} className={styles.image4} />
              <img src={urls[3]} className={styles.image4} />
            </div>
          </div>
        );
      case 5:
        return (
          <div className={styles.count5}>
            <div className={styles.row5_1}>
              <img src={urls[0]} className={styles.image5_1} />
              <img src={urls[1]} className={styles.image5_1} />
              <img src={urls[2]} className={styles.image5_1} />
            </div>
            <div className={styles.row5_2}>
              <img src={urls[3]} className={styles.image5_2} />
              <img src={urls[4]} className={styles.image5_2} />
            </div>
          </div>
        );
      case 6:
        return (
          <div className={styles.count5}>
            <div className={styles.row5_1}>
              <img src={urls[0]} className={styles.image5_1} />
              <img src={urls[1]} className={styles.image5_1} />
              <img src={urls[2]} className={styles.image5_1} />
            </div>
            <div className={styles.row5_1}>
              <img src={urls[3]} className={styles.image5_2} />
              <img src={urls[4]} className={styles.image5_2} />
              <img src={urls[5]} className={styles.image5_2} />
            </div>
          </div>
        );
      case 7:
        return (
          <div className={styles.count7}>
            <div className={styles.row5_1}>
              <img src={urls[0]} className={styles.image5_1} />
              <img src={urls[1]} className={styles.image5_1} />
              <img src={urls[2]} className={styles.image5_1} />
            </div>
            <div className={styles.row5_2}>
              <img src={urls[3]} className={styles.image5_2} />
              <img src={urls[4]} className={styles.image5_2} />
            </div>
            <div className={styles.row5_2}>
              <img src={urls[5]} className={styles.image5_2} />
              <img src={urls[6]} className={styles.image5_2} />
            </div>
          </div>
        );
      case 8:
        return (
          <div className={styles.count7}>
            <div className={styles.row5_1}>
              <img src={urls[0]} className={styles.image5_1} />
              <img src={urls[1]} className={styles.image5_1} />
              <img src={urls[2]} className={styles.image5_1} />
            </div>
            <div className={styles.row5_1}>
              <img src={urls[3]} className={styles.image5_1} />
              <img src={urls[4]} className={styles.image5_1} />
              <img src={urls[5]} className={styles.image5_1} />
            </div>
            <div className={styles.row5_2}>
              <img src={urls[6]} className={styles.image5_2} />
              <img src={urls[7]} className={styles.image5_2} />
            </div>
          </div>
        );
      case 9:
        return (
          <div className={styles.count7}>
            <div className={styles.row5_1}>
              <img src={urls[0]} className={styles.image5_1} />
              <img src={urls[1]} className={styles.image5_1} />
              <img src={urls[2]} className={styles.image5_1} />
            </div>
            <div className={styles.row5_1}>
              <img src={urls[3]} className={styles.image5_1} />
              <img src={urls[4]} className={styles.image5_1} />
              <img src={urls[5]} className={styles.image5_1} />
            </div>
            <div className={styles.row5_1}>
              <img src={urls[6]} className={styles.image5_1} />
              <img src={urls[7]} className={styles.image5_1} />
              <img src={urls[8]} className={styles.image5_1} />
            </div>
          </div>
        );
    }
  };

  return <div className={styles.container}>{renderImages()}</div>;
};

export default ImageGrid;
