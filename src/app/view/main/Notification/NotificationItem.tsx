import React from 'react';
import styles from './NotificationItem.module.css';
import {BoldSetting} from '@ui/Icons';

export interface NotificationAction {
  label: string;
  onClick: () => void;
  type?: 'primary' | 'secondary';
}

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
          <span className={styles.timeText}>{time}</span>
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
      </div>
    </div>
  );
};

export default NotificationItem;
