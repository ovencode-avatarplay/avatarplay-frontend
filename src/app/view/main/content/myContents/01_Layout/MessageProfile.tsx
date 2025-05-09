import React, {useState} from 'react';
import styles from './MessageProfile.module.css';
import {BoldInfo, BoldMore, BoldPin, LineCheck, LineDelete} from '@ui/Icons';
import {getLocalizedLink, pushLocalizedRoute} from '@/utils/UrlMove';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {sendCheckDMChatLinkKey, sendUrlEnterDMChat, UrlEnterDMChatReq} from '@/app/NetWork/ChatMessageNetwork';
import LoadingOverlay from '@/components/create/LoadingOverlay';

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
  roomid?: string;
  isDM?: boolean;
  onClickOption?: () => void;
  urlLinkKey: string;
  profileUrlLinkKey?: string;
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
  roomid,
  isDM = false,
  onClickOption,
  urlLinkKey,
  profileUrlLinkKey,
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

  const [isLoading, setIsLoading] = useState(false);
  const checkDMLinkKey = async () => {
    try {
      setIsLoading(true);
      const response = await sendCheckDMChatLinkKey({profileUrlLinkKey: profileUrlLinkKey || ''});
      setIsLoading(false);
      if (response.resultCode === 0) {
        pushLocalizedRoute('/DM/' + response.data?.dmChatUrlLinkKey, router);
      } else {
        console.log(`에러 발생: ${response.resultMessage}`);
      }
    } catch (error) {
      console.log('요청 중 오류가 발생했습니다.');
    }
  };
  return (
    <div className={styles.container}>
      {/* 체크 왼쪽 */}
      {checkType === CheckType.Left && renderCheck()}

      {/* 프로필 이미지 */}
      <div className={styles.profileContainer} onClick={() => pushLocalizedRoute('/profile/' + roomid, router)}>
        <img src={profileImage} alt="Profile" className={styles.profileImage} />
        {isHighlight && <div className={styles.statusIndicator} />}
      </div>

      {isDM ? (
        <div
          className={styles.profileInfo}
          onClick={() => {
            if (urlLinkKey == '') checkDMLinkKey();
            else pushLocalizedRoute('/DM/' + urlLinkKey, router);
          }}
        >
          {/* 프로필 정보 */}
          <div className={styles.profileTop}>
            <span className={styles.profileName}>{profileName}</span>
            {renderBadge()}
          </div>
          {timestamp && <span className={styles.timestamp}>{timestamp}</span>}
        </div>
      ) : (
        <Link
          href={getLocalizedLink(`/chat/?v=${urlLinkKey}` || `?v=`)}
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

      <LoadingOverlay loading={isLoading} />
    </div>
  );
};

export default MessageProfile;
