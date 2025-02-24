import React from 'react';
import styles from './CharacterCreateViewImage.module.css';
import {BoldLock, LineClose} from '@ui/Icons';
import EmptyState from '@/components/search/EmptyState';

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
        {imageUrl ? (
          <div
            className={styles.imageContainer}
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
        ) : (
          <div className={styles.emptyStateWrapper}>
            <EmptyState stateText="It's Empty!" />
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterCreateViewImage;
