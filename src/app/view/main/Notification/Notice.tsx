import React from 'react';
import styles from './Notice.module.css';
import NotificationItem, {NotificationAction} from './NotificationItem';
import {NotificationInfo, NotificationContentType} from '@/app/NetWork/NotificationNetwork';

interface NoticeProps {
  notification: NotificationInfo;
}

const Notice: React.FC<NoticeProps> = ({notification}) => {
  const getActions = (notification: NotificationInfo): NotificationAction[] | undefined => {
    if (notification.contentType === NotificationContentType.AddFriend) {
      return [
        {label: '수락', onClick: () => {}, type: 'primary'},
        {label: '거절', onClick: () => {}, type: 'secondary'},
      ];
    }
    return undefined;
  };

  return (
    <div className={styles.list}>
      <NotificationItem
        key={notification.id}
        avatar={notification.senderProfileIconUrl}
        title={notification.messageKey}
        text={notification.messageValueList.join(' ')}
        time={notification.createdAt}
        unread={!notification.isRead}
        actions={getActions(notification)}
        type={notification.systemType === 0 ? 'action' : 'normal'}
        isSystem={notification.systemType === 2}
      />
    </div>
  );
};

export default Notice;
