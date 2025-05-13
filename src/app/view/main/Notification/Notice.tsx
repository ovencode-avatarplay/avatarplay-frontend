import React from 'react';
import styles from './Notice.module.css';
import NotificationItem, {NotificationAction} from './NotificationItem';

const notifications = [
  {
    id: 1,
    avatar: '/lora/anylora.png',
    title: '[oo] sent you a friend request',
    time: '2025-05-12 10:00:00',
    type: 'action' as const,
    unread: true,
    actions: [
      {label: 'Accept', onClick: () => {}, type: 'primary' as const},
      {label: 'Ignore', onClick: () => {}, type: 'secondary' as const},
    ],
  },
  {
    id: 2,
    avatar: '/lora/anylora.png',
    title: '{OO} has requested to become a manager of {Channel00} with {OO permission}.',
    time: '2025-05-12 10:00:00',
    type: 'action' as const,
    unread: true,
    actions: [
      {label: 'Accept', onClick: () => {}, type: 'primary' as const},
      {label: 'Ignore', onClick: () => {}, type: 'secondary' as const},
      {label: 'Preview', onClick: () => {}, type: 'secondary' as const},
    ],
  },
  {
    id: 3,
    avatar: '/lora/anylora.png',
    title: '[oo] followed [target]',
    time: '2025-05-12 10:00:00',
    type: 'normal' as const,
    unread: false,
    text: '',
  },
  {
    id: 4,
    avatar: '/lora/anylora.png',
    title: '[oo] followed you',
    time: '2025-05-12 10:00:00',
    type: 'action' as const,
    unread: false,
    actions: [{label: 'Follow', onClick: () => {}, type: 'primary' as const}],
  },
  {
    id: 5,
    avatar: '/lora/anylora.png',
    title: '📩 [oo] sent you a new message.',
    time: '2025-05-12 10:00:00',
    type: 'action' as const,
    unread: false,
    actions: [{label: 'Follow', onClick: () => {}, type: 'primary' as const}],
  },
  {
    id: 6,
    avatar: '/lora/anylora.png',
    title: '[oo] commented on [target name]',
    time: '2025-05-12 10:00:00',
    type: 'normal' as const,
    unread: false,
    text: '',
  },
  {
    id: 7,
    avatar: '/lora/anylora.png',
    title: 'You have subscribed to {target} contents',
    time: '2025-05-12 10:00:00',
    type: 'normal' as const,
    unread: false,
    text: '',
  },
  {
    id: 8,
    avatar: '/lora/anylora.png',
    title: '{OO} has donated ⭐ 50 stars to {Target}.',
    time: '2025-05-12 10:00:00',
    type: 'action' as const,
    unread: false,
    actions: [{label: 'View Donation Details', onClick: () => {}, type: 'primary' as const}],
    isSystem: true,
  },
  {
    id: 9,
    avatar: '/lora/anylora.png',
    title: '{ㅇㅇ user}, whom you follow, has created a new {character/channel}.',
    time: '2025-05-12 10:00:00',
    type: 'action' as const,
    unread: false,
    actions: [{label: 'View Profile', onClick: () => {}, type: 'primary' as const}],
    isSystem: true,
  },
  {
    id: 10,
    avatar: '/lora/anylora.png',
    title: '[oo] commented on [target name]',
    time: '2025-05-12 10:00:00',
    type: 'normal' as const,
    unread: true,
    text: '',
    isSystem: true,
  },
  {
    id: 11,
    avatar: '/lora/anylora.png',
    title: '❗ Recharge Failed',
    time: '2025-05-12 10:00:00',
    type: 'system' as const,
    unread: true,
    text: 'The transaction was not completed or an error occurred.\nPlease try again or contact support.',
    actions: [
      {label: 'Try Again', onClick: () => {}, type: 'primary' as const},
      {label: 'Contact Support', onClick: () => {}, type: 'secondary' as const},
    ],
    isSystem: true,
  },
];

const Notice: React.FC = () => {
  return (
    <div className={styles.list}>
      {notifications.map(n => (
        <NotificationItem
          key={n.id}
          avatar={n.avatar}
          title={n.title}
          text={n.text}
          time={n.time}
          unread={n.unread}
          actions={n.actions}
          type={n.type}
          isSystem={n.isSystem}
        />
      ))}
    </div>
  );
};

export default Notice;
