import React from 'react';
import styles from './ContentItem.module.css';
import ShareIcon from '@mui/icons-material/Share';
import {ContentDashboardItem} from '@/redux-store/slices/MyContentDashboard';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import PhotoIcon from '@mui/icons-material/Photo';
import MovieIcon from '@mui/icons-material/Movie';
import {Box} from '@mui/material';

interface ContentItemProps {
  dashboardItem: ContentDashboardItem;
  isSelected: boolean;
}

const ContentItem: React.FC<ContentItemProps> = ({dashboardItem, isSelected}) => {
  const handleShareContent = () => {
    // TODO : 주소 받아와서 클립보드에  붙여넣기
  };

  return (
    <div className={styles.container} style={{backgroundColor: isSelected ? 'red' : 'blue'}}>
      <div className={styles.thumbnailArea}>
        <Box
          className={styles.thumbnail}
          sx={{
            width: '100%',
            height: '100%',
            background: `url(${dashboardItem.thumbnail})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Overlay for Image */}
          <Box className={styles.imageOverlay}>
            <Box className={styles.iconInfo}>
              <MovieIcon />
              {dashboardItem.videoCount}
            </Box>
            <Box className={styles.iconInfo}>
              <PhotoIcon />
              {dashboardItem.thumbnailCount}
            </Box>
          </Box>
        </Box>
      </div>
      <div className={styles.description}>
        <div className={styles.topRow}>
          <span className={styles.createdDate}>{dashboardItem.createAt}</span>
          <button className={styles.buttonShare} onClick={handleShareContent}>
            <ShareIcon />
            Share
          </button>
        </div>
        <h2 className={styles.title}>{dashboardItem.name}</h2>
        <div className={styles.bottomRow}>
          <span className={styles.talkCount}>
            <ChatBubbleOutlineIcon className={styles.icon} />
            {`Talk Count: ${dashboardItem.messageCount}`}
          </span>
          <span className={styles.people}>
            <PeopleOutlineIcon className={styles.icon} />
            {`People: ${dashboardItem.followCount}`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ContentItem;
