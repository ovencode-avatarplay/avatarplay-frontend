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
    <header className={styles.header}>
      <div className={styles.baseArea}>
        <button className={styles.backButton} onClick={onClose}>
          <img src={BoldArrowLeft.src} className={styles.backIcon} />
        </button>
        <h1 className={styles.navTitle}>{title}</h1>
      </div>
      {children && <div className={styles.childrenArea}>{children}</div>}
    </header>
  );
};

export default CreateDrawerHeader;
