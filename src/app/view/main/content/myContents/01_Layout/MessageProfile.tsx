import React from 'react';
import styles from './MessageProfile.module.css';
import {BoldInfo, BoldMore, BoldPin, LineCheck, LineDelete} from '@ui/Icons';

interface Props {
  profileImage: string;
  profileName: string;
  level: string;
  timestamp?: string;
  badgeType?: BadgeType;
  followState?: FollowState;
  checkType?: CheckType;
  isOption?: boolean;
  isPin?: boolean;
  isHighlight?: boolean;
  onClick: () => void;
}

export enum BadgeType {
  None,
  Fan,
  Original,
}

export enum FollowState {
  None,
  Follow,
  Following,
  AddFriend,
  FriendCancel,
}

export enum CheckType {
  None,
  Left,
  Right,
}

const MessageProfile: React.FC<Props> = ({
  profileImage,
  profileName,
  level,
  timestamp,
  badgeType = BadgeType.None,
  followState = FollowState.None,
  checkType = CheckType.None,
  isOption = false,
  isPin = false,
  isHighlight = false,
  onClick,
}) => {
  const renderBadge = () => {
    if (badgeType === BadgeType.Fan) {
      return <span className={styles.fanBadge}>Fan</span>;
    }
    if (badgeType === BadgeType.Original) {
      return <span className={styles.originalBadge}>Original</span>;
    }
    return null;
  };

  const renderFollowButton = () => {
    switch (followState) {
      case FollowState.Follow:
        return <button className={styles.follow}>Follow</button>;
      case FollowState.Following:
        return <button className={styles.following}>Following</button>;
      case FollowState.AddFriend:
        return <button className={styles.follow}>Add Friend</button>;
      case FollowState.FriendCancel:
        return <button className={styles.following}>Cancel</button>;
      default:
        return null;
    }
  };

  const renderCheck = () => {
    if (checkType === CheckType.Left) {
      return (
        <div className={styles.checkLeft}>
          <img src={LineCheck.src} alt="check" />
        </div>
      );
    }
    if (checkType === CheckType.Right) {
      return (
        <div className={styles.checkRight}>
          <img src={LineCheck.src} alt="check" />
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.container}>
      {/* 체크 왼쪽 */}
      {checkType === CheckType.Left && renderCheck()}

      {/* 프로필 이미지 */}
      <div className={styles.profileContainer}>
        <img src={profileImage} alt="Profile" className={styles.profileImage} />
        {isHighlight && <div className={styles.statusIndicator} />}
      </div>

      {/* 프로필 정보 */}
      <div
        className={styles.profileInfo}
        onClick={() => {
          onClick();
        }}
      >
        <div className={styles.profileTop}>
          <span className={styles.profileName}>{profileName}</span>
          {renderBadge()}
        </div>
        {timestamp && <span className={styles.timestamp}>{timestamp}</span>}
      </div>

      {/* 오른쪽 영역 */}
      <div className={styles.rightArea}>
        {renderFollowButton()}
        {checkType === CheckType.Right && renderCheck()}

        {isOption && (
          <div className={styles.optionWrap}>
            {isPin && <img src={BoldPin.src} alt="pin" className={styles.pinIcon} />}
            <img src={BoldMore.src} alt="more" className={styles.moreIcon} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageProfile;
