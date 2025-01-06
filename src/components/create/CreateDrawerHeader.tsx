import React from 'react';
import styles from './CreateDrawerHeader.module.css';
import {BoldArrowLeft} from '@ui/Icons';

interface Props {
  title: string;
  onClose: () => void;
  children?: React.ReactNode /*컴포지션*/;
}

const CreateDrawerHeader: React.FC<Props> = ({title, onClose, children}) => {
  return (
    <div className={styles.header}>
      <div className={styles.baseArea}>
        <button className={styles.backButton} onClick={onClose}>
          <img src={BoldArrowLeft.src} className={styles.backIcon} />
        </button>
        <div className={styles.navTitle}>{title}</div>
      </div>
      {children && <div className={styles.childrenArea}>{children}</div>}
    </div>
  );
};

export default CreateDrawerHeader;
