import React from 'react';
import styles from './NotificationItem.module.css';
import {BoldSetting} from '@ui/Icons';
import exp from 'constants';
import getLocalizedText from '@/utils/getLocalizedText';
import formatText from '@/utils/formatText';

export interface NotificationAction {
  label: string;
  onClick: () => void;
  type?: 'primary' | 'secondary';
}
export const formatTimeAgo = (time: string): string => {
  const now = new Date();
  const commentTime = new Date(time);
  const diffInSeconds = Math.floor((now.getTime() - commentTime.getTime()) / 1000);

  if (diffInSeconds < 60) return getLocalizedText('common_time_just_now');

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${formatText(getLocalizedText('common_time_minago'), [diffInMinutes.toString()])}`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${formatText(getLocalizedText('common_time_hourago'), [diffInHours.toString()])}`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${formatText(getLocalizedText('common_time_days_ago'), [diffInDays.toString()])}`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${formatText(getLocalizedText('common_time_week_ago'), [diffInWeeks.toString()])}`;
  }

  const diffInMonths = Math.floor(diffInWeeks / 4);
  if (diffInMonths < 12) {
    return `${formatText(getLocalizedText('common_time_month_ago'), [diffInMonths.toString()])}`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${formatText(getLocalizedText('common_time_year_ago'), [diffInYears.toString()])}`;
};

export interface NotificationItemProps {
  avatar: string;
  title: string;
  text?: string;
  time: string;
  unread?: boolean;
  actions?: NotificationAction[];
  menu?: React.ReactNode;
  type?: 'normal' | 'action' | 'system';
  onAvatarClick?: () => void;
  isHighlight?: boolean;
  isSystem?: boolean;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  avatar,
  title,
  text,
  time,
  unread,
  actions,
  menu,
  type = 'normal',
  onAvatarClick,
  isHighlight,
  isSystem,
}) => {
  return (
    <div className={styles.notification + (unread ? ' ' + styles.unread : '')}>
      <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
        {/* {unread && <span className={styles.dot} />} */}
        <div
          className={styles.profileContainer}
          onClick={onAvatarClick}
          style={{cursor: onAvatarClick ? 'pointer' : 'default'}}
        >
          {!isSystem && <img src={avatar} className={styles.avatar} alt="avatar" />}
          {isSystem && <img src={BoldSetting.src} className={styles.systemAvatar} />}
          {isHighlight && <div className={styles.statusIndicator} />}
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.titleRow}>
          <span className={styles.notiTitle}>{title}</span>
          <span className={styles.menu}>{menu ?? '⋮'}</span>
        </div>
        {type === 'action' && actions ? (
          <div className={styles.actions}>
            {actions.map((a, i) => (
              <button
                key={a.label + i}
                className={a.type === 'primary' ? styles.accept : styles.decline}
                onClick={a.onClick}
              >
                {a.label}
              </button>
            ))}
          </div>
        ) : text ? (
          <div className={styles.notiText}>{text}</div>
        ) : null}

        <span className={styles.timeText}>{formatTimeAgo(time)}</span>
      </div>
    </div>
  );
};

export default NotificationItem;
