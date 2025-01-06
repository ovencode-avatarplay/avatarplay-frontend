import React from 'react';
import styles from './EpisodeInitializeBackground.module.css';
import {LineCheck} from '@ui/Icons';

interface BackgroundData {
  name: string;
  url: string;
  id: number;
}

interface EpisodeInitializeBackgroundProps {
  data: BackgroundData[];
  selectedIdx: number;
  onSelect: (idx: number) => void;
}

const EpisodeInitializeBackground: React.FC<EpisodeInitializeBackgroundProps> = ({data, selectedIdx, onSelect}) => {
  return (
    <div className={styles.imageList}>
      {data.map((item, idx) => {
        const isSelected = selectedIdx === idx;
        return (
          <div key={idx} className={styles.itemContainer}>
            <div
              className={`${styles.imageItem} ${isSelected ? styles.selected : ''}`}
              style={{
                backgroundImage: isSelected
                  ? `linear-gradient(0deg, rgba(0, 0, 0, 0.50) 0%, rgba(0, 0, 0, 0.50) 100%), url(${item.url})`
                  : `url(${item.url})`,
              }}
              onClick={() => onSelect(idx)}
            >
              {isSelected && <img src={LineCheck.src} className={styles.selectedIcon} alt="Selected Icon" />}

              <div className={`${styles.name}  ${isSelected && styles.selectedName}`}>{item.name}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EpisodeInitializeBackground;
