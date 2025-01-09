import React, {useState} from 'react';
import styles from './ContentItem.module.css';
import {ContentDashboardItem} from '@/redux-store/slices/MyContentDashboard';
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
  onEditClicked: () => void;
  onDeleteClicked: () => void;
  dateOption: number;
}

const ContentItem: React.FC<ContentItemProps> = ({
  dashboardItem,
  isSelected,
  onEditClicked,
  onDeleteClicked,
  dateOption,
}) => {
  const handleShareContent = () => {
    if (dashboardItem.urlLinkKey) {
      const fullUrl = `${window.location.origin}/chat?${dashboardItem.urlLinkKey}`;

      navigator.clipboard
        .writeText(fullUrl)
        .then(() => {
          alert('URL이 클립보드에 복사되었습니다.');
        })
        .catch(err => {
          console.error('클립보드 복사 중 에러 발생:', err);
          alert('클립보드에 복사할 수 없습니다.');
        });
    } else {
      console.warn('URL이 유효하지 않습니다.');
      alert('공유할 수 있는 URL이 없습니다.');
    }
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
      onClick: onEditClicked,
    },
    {
      name: 'Preview',
      icon: LinePreview.src,
      onClick: () => console.log('Preview clicked'),
    },
    {
      name: 'Share',
      icon: LineShare.src,
      onClick: handleShareContent,
    },
    {
      name: 'Delete',
      icon: LineDelete.src,
      onClick: () => {
        onDeleteClicked();
        setDropBoxOpen(false);
      },
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
          ></Box>
        </div>
        <div className={styles.descriptionArea}>
          <div className={styles.contentInfo}>
            <div className={styles.infoArea}>
              <div className={styles.dateText}>
                {dateOption === 1 ? formattedDate(dashboardItem.updateAt) : formattedDate(dashboardItem.createAt)}
              </div>
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
              <div
                className={`${styles.publishLabel} ${
                  dashboardItem.visibilityType === 3 ? styles.saved : styles.published
                }`}
              >
                {dashboardItem.visibilityType === 3
                  ? 'Saved'
                  : dashboardItem.visibilityType === 2
                  ? 'Publsih'
                  : dashboardItem.visibilityType === 1
                  ? 'Unlisted'
                  : dashboardItem.visibilityType === 0
                  ? 'Private'
                  : ''}
              </div>
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
        {dropBoxOpen && (
          <DropDownMenu
            items={dropDownMenuItems}
            onClose={() => setDropBoxOpen(false)}
            className={styles.contentItemDropDown}
          />
        )}
      </div>
    </div>
  );
};

export default ContentItem;
