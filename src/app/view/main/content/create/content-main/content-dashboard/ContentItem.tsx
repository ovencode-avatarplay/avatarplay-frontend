import React from 'react';
import styles from './ContentItem.module.css';
import {ContentDashboardItem} from '@/redux-store/slices/MyContentDashboard';

interface ContentItemProps {
  dashboardItem: ContentDashboardItem;
  isSelected: boolean;
}

const ContentItem: React.FC<ContentItemProps> = ({dashboardItem, isSelected}) => {
  return (
    <div className={styles.container} style={{backgroundColor: isSelected ? 'red' : 'blue'}}>
      <div className={styles.thumbnail}>
        <img src={dashboardItem.thumbnail} alt={dashboardItem.thumbnail} />
      </div>
      <div className={styles.description}>
        <div className={styles.topRow}>
          <span className={styles.createdDate}>{dashboardItem.createAt}</span>
          <button className={styles.buttonShare}>Share</button>
        </div>
        <h2 className={styles.title}>{dashboardItem.name}</h2>
        <div className={styles.bottomRow}>
          <span className={styles.talkCount}>{`Talk Count: ${dashboardItem.messageCount}`}</span>
          <span className={styles.people}>{`People: ${dashboardItem.followCount}`}</span>
        </div>
      </div>
    </div>
  );
};

export default ContentItem;
