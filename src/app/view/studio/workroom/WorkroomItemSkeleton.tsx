import React from 'react';
import styles from './WorkroomItem.module.css';

interface Props {
  detailView: boolean;
}

const WorkroomItemSkeleton: React.FC<Props> = ({detailView}) => {
  return (
    <div className={styles.workroomItem}>
      {detailView ? (
        <div className={styles.detailViewContainer}>
          <div className={`${styles.selectButton} ${styles.skeletonBox}`} />
          <div className={`${styles.itemIcon} ${styles.skeletonBox}`} />
          <div className={styles.fileInfoArea}>
            <div className={styles.infoLeftArea}>
              <div className={`${styles.fileName} ${styles.skeletonText}`} />
              <div className={`${styles.fileDetail} ${styles.skeletonText}`} />
            </div>
            <div className={styles.infoRightArea}>
              <div className={`${styles.bookMarkButton} ${styles.skeletonBox}`} />
              <div className={`${styles.btnMenu} ${styles.skeletonBox}`} />
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.largeViewContainer}>
          <div className={`${styles.fileImage} ${styles.skeletonBox}`} />
          <div className={styles.fileInfoArea}>
            <div className={styles.infoLeftArea}>
              <div className={`${styles.fileName} ${styles.skeletonText}`} />
              <div className={`${styles.fileDetail} ${styles.skeletonText}`} />
            </div>
            <div className={styles.infoRightArea}>
              <div className={`${styles.bookMarkButton} ${styles.skeletonBox}`} />
              <div className={`${styles.btnMenu} ${styles.skeletonBox}`} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkroomItemSkeleton;
