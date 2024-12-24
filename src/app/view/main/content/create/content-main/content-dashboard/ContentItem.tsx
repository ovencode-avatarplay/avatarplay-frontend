import React from 'react';
import styles from './ContentItem.module.css';
import ShareIcon from '@mui/icons-material/Share';
import {ContentDashboardItem} from '@/redux-store/slices/MyContentDashboard';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import PhotoIcon from '@mui/icons-material/Photo';
import MovieIcon from '@mui/icons-material/Movie';
import {Box} from '@mui/material';
import {MenuDots} from '@ui/chatting';

interface ContentItemProps {
  dashboardItem: ContentDashboardItem;
  isSelected: boolean;
}

const ContentItem: React.FC<ContentItemProps> = ({dashboardItem, isSelected}) => {
  const handleShareContent = () => {
    // TODO : 주소 받아와서 클립보드에  붙여넣기
  };

  return (
    <div className={styles.contentItem}>
      <div className={styles.container}>
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
                {dashboardItem.episodeCount}
              </Box>
              <Box className={styles.iconInfo}>
                <PhotoIcon />
                {dashboardItem.mediaCount}
              </Box>
            </Box>
          </Box>
        </div>
        <div className={styles.descriptionArea}>
          <div className={styles.contentInfo}>
            <div className={styles.infoArea}>
              <div className={styles.createData}>{dashboardItem.createAt}</div>
              <button className={styles.menuButton} onClick={() => {}}>
                <img className={styles.buttonIcon} src={MenuDots.src} />
              </button>
            </div>
            <div className={styles.titleArea}>
              <div className={styles.title}>{dashboardItem.name}</div>
            </div>
          </div>

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
    </div>
  );
};

export default ContentItem;
