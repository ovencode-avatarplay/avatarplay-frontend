import React, {useState} from 'react';
import styles from './ContentItem.module.css';
import {ContentDashboardItem} from '@/redux-store/slices/MyContentDashboard';
import PhotoIcon from '@mui/icons-material/Photo';
import MovieIcon from '@mui/icons-material/Movie';
import {Box} from '@mui/material';
import {MenuDots} from '@ui/chatting';
import {
  BoldChatRoundDots,
  BoldFollowers,
  BoldImage,
  BoldVideo,
  LineDelete,
  LineEdit,
  LinePreview,
  LineShare,
} from '@ui/Icons';
import DropDownMenu, {DropDownMenuItem} from '@/components/create/DropDownMenu';

interface ContentItemProps {
  dashboardItem: ContentDashboardItem;
  isSelected: boolean;
}

const ContentItem: React.FC<ContentItemProps> = ({dashboardItem, isSelected}) => {
  const handleShareContent = () => {
    // TODO : 주소 받아와서 클립보드에  붙여넣기
  };

  const formattedDate = (time: string) => {
    // time은 2024-07-02T12:26:07 형식으로 들어옴
    return time.split('T')[0]; // 2024-07-02 형식으로 변경
  };

  const [dropBoxOpen, setDropBoxOpen] = useState<boolean>(false);
  const dropDownMenuItems: DropDownMenuItem[] = [
    {
      name: 'Edit',
      icon: LineEdit.src,
      onClick: () => console.log('Edit clicked'),
    },
    {
      name: 'Preview',
      icon: LinePreview.src,
      onClick: () => console.log('Preview clicked'),
    },
    {
      name: 'Share',
      icon: LineShare.src,
      onClick: () => console.log('Share clicked'),
    },
    {
      name: 'Delete',
      icon: LineDelete.src,
      onClick: () => console.log('Delete clicked'),
      isRed: true, // Delete는 위험 동작으로 표시
    },
  ];

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
              <div className={styles.dateText}>{formattedDate(dashboardItem.createAt)}</div>
              <button
                className={styles.menuButton}
                onClick={() => {
                  setDropBoxOpen(!dropBoxOpen);
                }}
              >
                <img className={styles.buttonIcon} src={MenuDots.src} />
              </button>
            </div>
            <div className={styles.titleArea}>
              <div className={`${styles.publishLabel} ${styles.saved}`}> Saved</div>
              <div className={styles.title}>{dashboardItem.name}</div>
            </div>
          </div>

          <div className={styles.statisticsArea}>
            <div className={styles.statisticsItem}>
              <img className={styles.statisticsIcon} src={BoldVideo.src} />
              <div className={styles.statisticsText}> {dashboardItem.episodeCount}</div>
            </div>
            <div className={styles.statisticsItem}>
              <img className={styles.statisticsIcon} src={BoldImage.src} />
              <div className={styles.statisticsText}> {dashboardItem.mediaCount}</div>
            </div>
            <div className={styles.statisticsItem}>
              <img className={styles.statisticsIcon} src={BoldChatRoundDots.src} />
              <div className={styles.statisticsText}> {dashboardItem.messageCount}</div>
            </div>
            <div className={styles.statisticsItem}>
              <img className={styles.statisticsIcon} src={BoldFollowers.src} />
              <div className={styles.statisticsText}> {dashboardItem.followCount}</div>
            </div>
          </div>
        </div>
        {dropBoxOpen && <DropDownMenu items={dropDownMenuItems} className={styles.contentItemDropDown} />}
      </div>
    </div>
  );
};

export default ContentItem;
