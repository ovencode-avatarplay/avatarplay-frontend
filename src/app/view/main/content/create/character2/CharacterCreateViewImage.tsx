import React from 'react';
import styles from './CharacterCreateViewImage.module.css';
import {LineClose} from '@ui/Icons';

interface Props {
  imageUrl: string;
  onClose: () => void;
}

const CharacterCreateViewImage: React.FC<Props> = ({imageUrl, onClose}) => {
  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <img src={LineClose.src} className={styles.blackIcon} />
        </button>
        <img src={imageUrl} alt="Character Preview" className={styles.image} />
      </div>
    </div>
  );
};

export default CharacterCreateViewImage;
