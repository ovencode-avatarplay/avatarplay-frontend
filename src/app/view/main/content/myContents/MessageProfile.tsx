import React from 'react';
import styles from './MessageProfile.module.css';
import {BoldInfo, LineDelete} from '@ui/Icons';

interface Props {
  profileImage: string;
  profileName: string;
  level: string;
  timestamp: string;
}

const MessageProfile: React.FC<Props> = ({profileImage, profileName, level, timestamp}) => {
  return (
    <div className={styles.container}>
      {/* 프로필 이미지 */}
      <div className={styles.profileContainer}>
        <img src={profileImage} alt="Profile" className={styles.profileImage} />
        <div className={styles.statusIndicator} />
      </div>

      {/* 프로필 정보 */}
      <div className={styles.profileInfo}>
        <div className={styles.profileTop}>
          <span className={styles.profileName}>{profileName}</span>
          <div className={styles.levelBadge}>Lv.{level}</div>
        </div>
        <span className={styles.timestamp}>{timestamp}</span>
      </div>

      {/* 정보 아이콘 */}
      <div className={styles.infoIcon}>
        <img src={BoldInfo.src} className={styles.info} />
        <img src={LineDelete.src} className={styles.delete} />
      </div>
    </div>
  );
};

export default MessageProfile;
