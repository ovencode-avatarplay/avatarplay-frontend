import React from 'react';
import styles from './StoryDashboardHeader.module.css';
import {LineArrowLeft, LinePlus} from '@ui/Icons';

interface Props {
  title: string;
  onClose: () => void;
  isCreate?: boolean;
  onCreate?: () => void;
}

const StoryDashboardHeader: React.FC<Props> = ({title, onClose, onCreate, isCreate}) => {
  return (
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        <button className={styles.backButton} onClick={onClose}>
          <img src={LineArrowLeft.src} className={styles.backIcon} />
        </button>
        <div className={styles.navTitle}>{title}</div>
      </div>
      {isCreate && (
        <button className={styles.createButton} onClick={onCreate}>
          <div className={styles.buttonBox}>
            <img className={styles.buttonIcon} src={LinePlus.src} alt="Create Icon" />
            Create
          </div>
        </button>
      )}
    </div>
  );
};

export default StoryDashboardHeader;
