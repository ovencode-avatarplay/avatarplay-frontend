import React from 'react';
import styles from './CreateDrawerHeader.module.css';
import {BoldArrowLeft} from '@ui/Icons';

interface Props {
  title: string;
  onClose: () => void;
}

const CreateDrawerHeader: React.FC<Props> = ({title, onClose}) => {
  return (
    <div className={styles.header}>
      <button className={styles.backButton} onClick={onClose}>
        <img src={BoldArrowLeft.src} className={styles.backIcon} />
      </button>
      <div className={styles.navTitle}>{title}</div>
    </div>
  );
};

export default CreateDrawerHeader;
