import React from 'react';
import styles from './ImageGrid.module.css';

type ImageGridProps = {
  urls: string[];
  onClick?: (index: number) => void; // 수정
};

const ImageGrid: React.FC<ImageGridProps> = ({urls, onClick}) => {
  const renderImages = () => {
    switch (urls.length) {
      case 1:
        return (
          <div className={styles.count1}>
            <img src={urls[0]} className={styles.image} onClick={() => onClick?.(0)} />
          </div>
        );

      case 2:
        return (
          <div className={styles.count2}>
            <img src={urls[0]} className={styles.image} onClick={() => onClick?.(0)} />
            <img src={urls[1]} className={styles.image} onClick={() => onClick?.(1)} />
          </div>
        );
      case 3:
        return (
          <div className={styles.count3}>
            <img src={urls[0]} className={styles.image} onClick={() => onClick?.(0)} />
            <img src={urls[1]} className={styles.image} onClick={() => onClick?.(1)} />
            <img src={urls[2]} className={styles.image} onClick={() => onClick?.(2)} />
          </div>
        );
      case 4:
        return (
          <div className={styles.count4}>
            <div className={styles.row4}>
              <img src={urls[0]} className={styles.image4} onClick={() => onClick?.(0)} />
              <img src={urls[1]} className={styles.image4} onClick={() => onClick?.(1)} />
            </div>
            <div className={styles.row4}>
              <img src={urls[2]} className={styles.image4} onClick={() => onClick?.(2)} />
              <img src={urls[3]} className={styles.image4} onClick={() => onClick?.(3)} />
            </div>
          </div>
        );
      case 5:
        return (
          <div className={styles.count5}>
            <div className={styles.row5_1}>
              <img src={urls[0]} className={styles.image5_1} onClick={() => onClick?.(0)} />
              <img src={urls[1]} className={styles.image5_1} onClick={() => onClick?.(1)} />
              <img src={urls[2]} className={styles.image5_1} onClick={() => onClick?.(2)} />
            </div>
            <div className={styles.row5_2}>
              <img src={urls[3]} className={styles.image5_2} onClick={() => onClick?.(3)} />
              <img src={urls[4]} className={styles.image5_2} onClick={() => onClick?.(4)} />
            </div>
          </div>
        );
      case 6:
        return (
          <div className={styles.count5}>
            <div className={styles.row5_1}>
              <img src={urls[0]} className={styles.image5_1} onClick={() => onClick?.(0)} />
              <img src={urls[1]} className={styles.image5_1} onClick={() => onClick?.(1)} />
              <img src={urls[2]} className={styles.image5_1} onClick={() => onClick?.(2)} />
            </div>
            <div className={styles.row5_1}>
              <img src={urls[3]} className={styles.image5_2} onClick={() => onClick?.(3)} />
              <img src={urls[4]} className={styles.image5_2} onClick={() => onClick?.(4)} />
              <img src={urls[5]} className={styles.image5_2} onClick={() => onClick?.(5)} />
            </div>
          </div>
        );
      case 7:
        return (
          <div className={styles.count7}>
            <div className={styles.row5_1}>
              <img src={urls[0]} className={styles.image5_1} onClick={() => onClick?.(0)} />
              <img src={urls[1]} className={styles.image5_1} onClick={() => onClick?.(1)} />
              <img src={urls[2]} className={styles.image5_1} onClick={() => onClick?.(2)} />
            </div>
            <div className={styles.row5_2}>
              <img src={urls[3]} className={styles.image5_2} onClick={() => onClick?.(3)} />
              <img src={urls[4]} className={styles.image5_2} onClick={() => onClick?.(4)} />
            </div>
            <div className={styles.row5_2}>
              <img src={urls[5]} className={styles.image5_2} onClick={() => onClick?.(5)} />
              <img src={urls[6]} className={styles.image5_2} onClick={() => onClick?.(6)} />
            </div>
          </div>
        );
      case 8:
        return (
          <div className={styles.count7}>
            <div className={styles.row5_1}>
              <img src={urls[0]} className={styles.image5_1} onClick={() => onClick?.(0)} />
              <img src={urls[1]} className={styles.image5_1} onClick={() => onClick?.(1)} />
              <img src={urls[2]} className={styles.image5_1} onClick={() => onClick?.(2)} />
            </div>
            <div className={styles.row5_1}>
              <img src={urls[3]} className={styles.image5_1} onClick={() => onClick?.(3)} />
              <img src={urls[4]} className={styles.image5_1} onClick={() => onClick?.(4)} />
              <img src={urls[5]} className={styles.image5_1} onClick={() => onClick?.(5)} />
            </div>
            <div className={styles.row5_2}>
              <img src={urls[6]} className={styles.image5_2} onClick={() => onClick?.(6)} />
              <img src={urls[7]} className={styles.image5_2} onClick={() => onClick?.(7)} />
            </div>
          </div>
        );
      case 9:
        return (
          <div className={styles.count7}>
            <div className={styles.row5_1}>
              <img src={urls[0]} className={styles.image5_1} onClick={() => onClick?.(0)} />
              <img src={urls[1]} className={styles.image5_1} onClick={() => onClick?.(1)} />
              <img src={urls[2]} className={styles.image5_1} onClick={() => onClick?.(2)} />
            </div>
            <div className={styles.row5_1}>
              <img src={urls[3]} className={styles.image5_1} onClick={() => onClick?.(3)} />
              <img src={urls[4]} className={styles.image5_1} onClick={() => onClick?.(4)} />
              <img src={urls[5]} className={styles.image5_1} onClick={() => onClick?.(5)} />
            </div>
            <div className={styles.row5_1}>
              <img src={urls[6]} className={styles.image5_1} onClick={() => onClick?.(6)} />
              <img src={urls[7]} className={styles.image5_1} onClick={() => onClick?.(7)} />
              <img src={urls[8]} className={styles.image5_1} onClick={() => onClick?.(8)} />
            </div>
          </div>
        );
    }
  };

  return <div className={styles.container}>{renderImages()}</div>;
};

export default ImageGrid;
