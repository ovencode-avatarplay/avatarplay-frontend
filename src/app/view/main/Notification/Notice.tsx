import React from 'react';
import styles from './Notice.module.css';

const notifications = [
  {
    id: 1,
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    title: 'Notification text',
    text: '',
    time: '2m',
    type: 'action',
    unread: true,
  },
  {
    id: 2,
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    title: 'Notification text',
    text: 'Notification text',
    time: '2m',
    type: 'normal',
    unread: false,
  },
  {
    id: 3,
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    title: 'Notification text',
    text: 'Notification text',
    time: '2m',
    type: 'normal',
    unread: false,
  },
];

const Notice: React.FC = () => {
  return (
    <div className={styles.list}>
      {notifications.map(n => (
        <div key={n.id} className={styles.notification + (n.unread ? ' ' + styles.unread : '')}>
          <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
            {n.unread && <span className={styles.dot} />}
            <img src={n.avatar} className={styles.avatar} alt="avatar" />
          </div>
          <div className={styles.content}>
            <div className={styles.titleRow}>
              <span className={styles.notiTitle}>{n.title}</span>
              <span className={styles.timeText}>{n.time}</span>
              <span className={styles.menu}>⋮</span>
            </div>
            {n.type === 'action' ? (
              <div className={styles.actions}>
                <button className={styles.accept}>Accept</button>
                <button className={styles.decline}>Decline</button>
              </div>
            ) : (
              <div className={styles.notiText}>{n.text}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notice;
