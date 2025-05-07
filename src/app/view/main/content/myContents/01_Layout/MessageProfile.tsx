import React from 'react';
import styles from './MessageProfile.module.css';
import {BoldInfo, BoldMore, BoldPin, LineCheck, LineDelete} from '@ui/Icons';
import {getLocalizedLink, pushLocalizedRoute} from '@/utils/UrlMove';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {sendUrlEnterDMChat, UrlEnterDMChatReq} from '@/app/NetWork/ChatMessageNetwork';

interface Props {
  profileImage: string;
  profileName: string;
  level?: string;
  timestamp?: string;
  badgeType?: BadgeType;
  followState?: FollowState;
  checkType?: CheckType;
  isOption?: boolean;
  isPin?: boolean;
  isHighlight?: boolean;
  urlLinkKeyProfile?: string;
  isDM?: boolean;
  onClickOption?: () => void;
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
  urlLinkKeyProfile,
  isDM = false,
  onClickOption,
}) => {
  const router = useRouter();
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

  const onDM = async () => {
    if (!urlLinkKeyProfile) return;
    const payload: UrlEnterDMChatReq = {
      urlLinkKey: urlLinkKeyProfile,
      chatRoomId: 0,
    };

    try {
      const res = await sendUrlEnterDMChat(payload);
      if (res.resultCode === 0) {
        pushLocalizedRoute('/message/DM/' + urlLinkKeyProfile, router);
        return;
      } else {
        return `⚠️ 오류: ${res.resultMessage}`;
      }
    } catch (error: any) {
      return;
    }
  };

  return (
    <div className={styles.container}>
      {/* 체크 왼쪽 */}
      {checkType === CheckType.Left && renderCheck()}

      {/* 프로필 이미지 */}
      <div
        className={styles.profileContainer}
        onClick={() => pushLocalizedRoute('/profile/' + urlLinkKeyProfile, router)}
      >
        <img src={profileImage} alt="Profile" className={styles.profileImage} />
        {isHighlight && <div className={styles.statusIndicator} />}
      </div>

      {isDM ? (
        <div className={styles.profileInfo} onClick={() => {}}>
          {/* 프로필 정보 */}
          <div className={styles.profileTop}>
            <span className={styles.profileName}>{profileName}</span>
            {renderBadge()}
          </div>
          {timestamp && <span className={styles.timestamp}>{timestamp}</span>}
        </div>
      ) : (
        <Link
          href={getLocalizedLink(`/chat/?v=${urlLinkKeyProfile}` || `?v=`)}
          className={styles.profileInfo}
          onClick={() => {}}
        >
          {/* 프로필 정보 */}
          <div className={styles.profileTop}>
            <span className={styles.profileName}>{profileName}</span>
            {renderBadge()}
          </div>
          {timestamp && <span className={styles.timestamp}>{timestamp}</span>}
        </Link>
      )}

      {/* 오른쪽 영역 */}
      <div className={styles.rightArea}>
        {renderFollowButton()}
        {checkType === CheckType.Right && renderCheck()}

        {isOption && (
          <button
            className={styles.optionWrap}
            onClick={() => {
              if (onClickOption) onClickOption();
            }}
          >
            {isPin && <img src={BoldPin.src} alt="pin" className={styles.pinIcon} />}
            <img src={BoldMore.src} alt="more" className={styles.moreIcon} />
          </button>
        )}
      </div>
    </div>
  );
};

export default MessageProfile;
