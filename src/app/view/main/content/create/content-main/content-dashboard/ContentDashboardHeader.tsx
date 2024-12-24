import React from 'react';
import styles from './ContentDashboardHeader.module.css';
import {BoldArrowLeft, LinePlus} from '@ui/Icons';

interface Props {
  title: string;
  onClose: () => void;
  onCreate: () => void;
}

const ContentDashboardHeader: React.FC<Props> = ({title, onClose, onCreate}) => {
  return (
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        <button className={styles.backButton} onClick={onClose}>
          <img src={BoldArrowLeft.src} className={styles.backIcon} />
        </button>
        <div className={styles.navTitle}>{title}</div>
      </div>
      <button className={styles.createButton}>
        <div className={styles.buttonBox}>
          <img className={styles.buttonIcon} src={LinePlus.src}></img>
          Create
        </div>
      </button>
    </div>
  );
};

export default ContentDashboardHeader;
