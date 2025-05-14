import React from 'react';
import styles from './CreateDrawerHeader.module.css';
import {LineArrowLeft} from '@ui/Icons';

interface Props {
  title: string;
  onClose: () => void;
  children?: React.ReactNode /*컴포지션*/;
  childrenAreaStyle?: React.CSSProperties;
}

const CreateDrawerHeader: React.FC<Props> = ({title, onClose, children, childrenAreaStyle}) => {
  return (
    <header className={styles.header}>
      <div className={styles.baseArea}>
        <button className={styles.backButton} onClick={onClose}>
          <img src={LineArrowLeft.src} className={styles.backIcon} />
        </button>
        <h1 className={styles.navTitle}>{title}</h1>
      </div>
      {children && (
        <div className={styles.childrenArea} style={childrenAreaStyle}>
          {children}
        </div>
      )}
    </header>
  );
};

export default CreateDrawerHeader;
