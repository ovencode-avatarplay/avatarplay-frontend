import React, {useState} from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import styles from './NotificationMain.module.css';
import {LineClose} from '@ui/Icons';
import Notice from './Notice';

interface NotificationMainProps {
  onClose: () => void;
}

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

const tabItems = ['Announcements', 'Notifications'];

export default function NotificationMain({onClose}: NotificationMainProps) {
  const [activeIndex, setActiveIndex] = useState(1);

  return (
    <Modal open={true} onClose={onClose}>
      <div className={styles.modalContainer}>
        <div className={styles.header}>
          <div className={styles.title}>Notification</div>
          <button className={styles.closeBtn} onClick={onClose}>
            <img src={LineClose.src} className={styles.blackFilter} />
          </button>
        </div>
        <div className={styles.tabContainer}>
          {tabItems.map((label, index) => (
            <div
              key={label}
              className={`${styles.tab} ${index === activeIndex ? styles.active : ''}`}
              onClick={() => setActiveIndex(index)}
            >
              {label}
            </div>
          ))}
        </div>
        {activeIndex === 0 && <div>공지사항 컴포넌트</div>}
        {activeIndex === 1 && <Notice />}
      </div>
    </Modal>
  );
}
