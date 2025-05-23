import React from 'react';
import styles from './Notice.module.css';
import NotificationItem, {NotificationAction} from './NotificationItem';
import {NotificationInfo, NotificationContentType} from '@/app/NetWork/NotificationNetwork';

interface NoticeProps {
  notification: NotificationInfo;
  onClick: () => void;
}

const Notice: React.FC<NoticeProps> = ({notification, onClick}) => {
  const getActions = (notification: NotificationInfo): NotificationAction[] | undefined => {
    switch (notification.contentType) {
      case NotificationContentType.AddFriend:
        return [
          {label: '수락', onClick: () => {}, type: 'primary'},
          {label: '거절', onClick: () => {}, type: 'secondary'},
        ];
      case NotificationContentType.AddFriendAccept:
        return [{label: '프로필 보기', onClick: () => {}, type: 'primary'}];
      case NotificationContentType.AddFriendReject:
        return [{label: '다시 요청', onClick: () => {}, type: 'primary'}];
      default:
        return undefined;
    }
  };

  const getNotificationType = (notification: NotificationInfo): 'normal' | 'action' | 'system' => {
    switch (notification.contentType) {
      case NotificationContentType.AddFriend:
      case NotificationContentType.AddFriendAccept:
      case NotificationContentType.AddFriendReject:
        return 'action';
      default:
        return notification.systemType === 2 ? 'system' : 'normal';
    }
  };

  return (
    <div className={styles.list} onClick={onClick}>
      <NotificationItem
        key={notification.id}
        avatar={notification.senderProfileIconUrl}
        title={notification.messageKey}
        text={notification.messageValueList.join(' ')}
        time={notification.createdAt}
        unread={!notification.isRead}
        actions={getActions(notification)}
        type={getNotificationType(notification)}
        isSystem={notification.systemType === 2}
      />
    </div>
  );
};

export default Notice;
