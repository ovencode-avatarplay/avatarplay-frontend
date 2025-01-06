import React from 'react';
import styles from './CreateTempCharacterSelect.module.css';
import {LineCheck} from '@ui/Icons';

interface CreateTempCharacterSelectProps {
  urls: string[];
  selectedIdx: number;
  onSelect: (idx: number) => void;
}
const CreateTempCharacterSelect: React.FC<CreateTempCharacterSelectProps> = ({urls, selectedIdx, onSelect}) => {
  return (
    <div className={styles.imageList}>
      {urls.map((url, idx) => {
        const isSelected = selectedIdx === idx;
        return (
          <div
            key={idx}
            className={`${styles.imageItem} ${isSelected ? styles.selected : ''}`}
            style={{
              backgroundImage: isSelected
                ? `linear-gradient(0deg, rgba(0, 0, 0, 0.50) 0%, rgba(0, 0, 0, 0.50) 100%), url(${url})`
                : `url(${url})`,
            }}
            onClick={() => onSelect(idx)}
          >
            {isSelected && <img src={LineCheck.src} className={styles.selectedIcon} alt="Selected Icon" />}
          </div>
        );
      })}
    </div>
  );
};

export default CreateTempCharacterSelect;
