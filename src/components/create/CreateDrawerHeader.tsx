import React from 'react';
import styles from './CreateDrawerHeader.module.css';
import {LineArrowLeft} from '@ui/Icons';

interface Props {
  title: string;
  onClose: () => void;
  children?: React.ReactNode /*컴포지션*/;
  style?: React.CSSProperties;
}

const CreateDrawerHeader: React.FC<Props> = ({title, onClose, children, style}) => {
  return (
    <header className={styles.header} style={style}>
      <div className={styles.baseArea}>
        <button className={styles.backButton} onClick={onClose}>
          <img src={LineArrowLeft.src} className={styles.backIcon} />
        </button>
        <h1 className={styles.navTitle}>{title}</h1>
      </div>
      {children && <div className={styles.childrenArea}>{children}</div>}
    </header>
  );
};

export default CreateDrawerHeader;
