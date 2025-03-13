import React from 'react';
import styles from './TriggerImageGrid.module.css';
import {Box} from '@mui/material';
import {CircleClose, LineClose} from '@ui/Icons';

type ImageGridProps = {
  urls: string[];
  onClick?: (index: number) => void; // 수정
};

const TriggerImageGrid: React.FC<ImageGridProps> = ({urls, onClick}) => {
  const renderImages = () => {
    switch (urls.length) {
      case 1:
        return (
          <div className={styles.count1}>
            <div className={styles.imageContainer}>
              <img src={urls[0]} className={styles.image} />
              <button className={styles.deleteButton} onClick={() => onClick?.(0)}>
                <img src={CircleClose.src}></img>
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className={styles.count2}>
            <div className={styles.imageContainer}>
              <img src={urls[0]} className={styles.image} />
              <button className={styles.deleteButton} onClick={() => onClick?.(0)}>
                <img src={CircleClose.src}></img>
              </button>
            </div>
            <div className={styles.imageContainer}>
              <img src={urls[1]} className={styles.image} />
              <button className={styles.deleteButton} onClick={() => onClick?.(1)}>
                <img src={CircleClose.src}></img>
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className={styles.count3}>
            <div className={styles.imageContainer}>
              <img src={urls[0]} className={styles.image} />
              <button className={styles.deleteButton} onClick={() => onClick?.(0)}>
                <img src={CircleClose.src}></img>
              </button>
            </div>
            <div className={styles.imageContainer}>
              <img src={urls[1]} className={styles.image} />
              <button className={styles.deleteButton} onClick={() => onClick?.(1)}>
                <img src={CircleClose.src}></img>
              </button>
            </div>
            <div className={styles.imageContainer}>
              <img src={urls[2]} className={styles.image} />
              <button className={styles.deleteButton} onClick={() => onClick?.(2)}>
                <img src={CircleClose.src}></img>
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className={styles.count4}>
            <div className={styles.row4}>
              <div className={styles.imageContainer}>
                <img src={urls[0]} className={styles.image4} />
                <button className={styles.deleteButton} onClick={() => onClick?.(0)}>
                  <img src={CircleClose.src}></img>
                </button>
              </div>
              <div className={styles.imageContainer}>
                <img src={urls[1]} className={styles.image4} />
                <button className={styles.deleteButton} onClick={() => onClick?.(1)}>
                  <img src={CircleClose.src}></img>
                </button>
              </div>
            </div>
            <div className={styles.row4}>
              <div className={styles.imageContainer}>
                <img src={urls[2]} className={styles.image4} />
                <button className={styles.deleteButton} onClick={() => onClick?.(2)}>
                  <img src={CircleClose.src}></img>
                </button>
              </div>
              <div className={styles.imageContainer}>
                <img src={urls[3]} className={styles.image4} />
                <button className={styles.deleteButton} onClick={() => onClick?.(3)}>
                  <img src={CircleClose.src}></img>
                </button>
              </div>
            </div>
          </div>
        );

      // 이하 case 5~9 동일 방식으로 반복
      case 5:
        return (
          <div className={styles.count5}>
            <div className={styles.row5_1}>
              <div className={styles.imageContainer}>
                <img src={urls[0]} className={styles.image5_1} />
                <button className={styles.deleteButton} onClick={() => onClick?.(0)}>
                  <img src={CircleClose.src}></img>
                </button>
              </div>
              <div className={styles.imageContainer}>
                <img src={urls[1]} className={styles.image5_1} />
                <button className={styles.deleteButton} onClick={() => onClick?.(1)}>
                  <img src={CircleClose.src}></img>
                </button>
              </div>
              <div className={styles.imageContainer}>
                <img src={urls[2]} className={styles.image5_1} />
                <button className={styles.deleteButton} onClick={() => onClick?.(2)}>
                  <img src={CircleClose.src}></img>
                </button>
              </div>
            </div>
            <div className={styles.row5_2}>
              <div className={styles.imageContainer}>
                <img src={urls[3]} className={styles.image5_2} />
                <button className={styles.deleteButton} onClick={() => onClick?.(3)}>
                  <img src={CircleClose.src}></img>
                </button>
              </div>
              <div className={styles.imageContainer}>
                <img src={urls[4]} className={styles.image5_2} />
                <button className={styles.deleteButton} onClick={() => onClick?.(4)}>
                  <img src={CircleClose.src}></img>
                </button>
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className={styles.count5}>
            <div className={styles.row5_1}>
              {urls.slice(0, 3).map((url, index) => (
                <div key={index} className={styles.imageContainer}>
                  <img src={url} className={styles.image5_1} />
                  <button className={styles.deleteButton} onClick={() => onClick?.(index)}>
                    <img src={CircleClose.src}></img>
                  </button>
                </div>
              ))}
            </div>
            <div className={styles.row5_1}>
              {urls.slice(3, 6).map((url, index) => (
                <div key={index + 3} className={styles.imageContainer}>
                  <img src={url} className={styles.image5_2} />
                  <button className={styles.deleteButton} onClick={() => onClick?.(index + 3)}>
                    <img src={CircleClose.src}></img>
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 7:
        return (
          <div className={styles.count7}>
            <div className={styles.row5_1}>
              {urls.slice(0, 3).map((url, index) => (
                <div key={index} className={styles.imageContainer}>
                  <img src={url} className={styles.image5_1} />
                  <button className={styles.deleteButton} onClick={() => onClick?.(index)}>
                    <img src={CircleClose.src}></img>
                  </button>
                </div>
              ))}
            </div>
            <div className={styles.row5_2}>
              {urls.slice(3, 5).map((url, index) => (
                <div key={index + 3} className={styles.imageContainer}>
                  <img src={url} className={styles.image5_2} />
                  <button className={styles.deleteButton} onClick={() => onClick?.(index + 3)}>
                    <img src={CircleClose.src}></img>
                  </button>
                </div>
              ))}
            </div>
            <div className={styles.row5_2}>
              {urls.slice(5, 7).map((url, index) => (
                <div key={index + 5} className={styles.imageContainer}>
                  <img src={url} className={styles.image5_2} />
                  <button className={styles.deleteButton} onClick={() => onClick?.(index + 5)}>
                    <img src={CircleClose.src}></img>
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 8:
        return (
          <div className={styles.count7}>
            <div className={styles.row5_1}>
              {urls.slice(0, 3).map((url, index) => (
                <div key={index} className={styles.imageContainer}>
                  <img src={url} className={styles.image5_1} />
                  <button className={styles.deleteButton} onClick={() => onClick?.(index)}>
                    <img src={CircleClose.src}></img>
                  </button>
                </div>
              ))}
            </div>
            <div className={styles.row5_1}>
              {urls.slice(3, 6).map((url, index) => (
                <div key={index + 3} className={styles.imageContainer}>
                  <img src={url} className={styles.image5_1} />
                  <button className={styles.deleteButton} onClick={() => onClick?.(index + 3)}>
                    <img src={CircleClose.src}></img>
                  </button>
                </div>
              ))}
            </div>
            <div className={styles.row5_2}>
              {urls.slice(6, 8).map((url, index) => (
                <div key={index + 6} className={styles.imageContainer}>
                  <img src={url} className={styles.image5_2} />
                  <button className={styles.deleteButton} onClick={() => onClick?.(index + 6)}>
                    <img src={CircleClose.src}></img>
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 9:
        return (
          <div className={styles.count7}>
            <div className={styles.row5_1}>
              {urls.slice(0, 3).map((url, index) => (
                <div key={index} className={styles.imageContainer}>
                  <img src={url} className={styles.image5_1} />
                  <button className={styles.deleteButton} onClick={() => onClick?.(index)}>
                    <img src={CircleClose.src}></img>
                  </button>
                </div>
              ))}
            </div>
            <div className={styles.row5_1}>
              {urls.slice(3, 6).map((url, index) => (
                <div key={index + 3} className={styles.imageContainer}>
                  <img src={url} className={styles.image5_1} />
                  <button className={styles.deleteButton} onClick={() => onClick?.(index + 3)}>
                    <img src={CircleClose.src}></img>
                  </button>
                </div>
              ))}
            </div>
            <div className={styles.row5_1}>
              {urls.slice(6, 9).map((url, index) => (
                <div key={index + 6} className={styles.imageContainer}>
                  <img src={url} className={styles.image5_1} />
                  <button className={styles.deleteButton} onClick={() => onClick?.(index + 6)}>
                    <img src={CircleClose.src}></img>
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return <div className={styles.container}>{renderImages()}</div>;
};

export default TriggerImageGrid;
