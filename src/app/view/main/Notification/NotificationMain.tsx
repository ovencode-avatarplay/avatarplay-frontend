import React, {useState, useEffect} from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import styles from './NotificationMain.module.css';
import {LineClose, LineSetting} from '@ui/Icons';
import Notice from './Notice';
import SwipeTagList from '@/components/layout/shared/SwipeTagList';
import CustomArrowHeader from '@/components/layout/shared/CustomArrowHeader';
import {Settings} from '@mui/icons-material';
import {useDispatch} from 'react-redux';
import {setUnread} from '@/redux-store/slices/Notification';

interface NotificationMainProps {
  open: boolean;
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

const tags = ['All', 'Request', 'Notice', 'System'];

export default function NotificationMain({open, onClose}: NotificationMainProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    if (open) {
      dispatch(setUnread(false));
    }
  }, [open, dispatch]);

  return (
    <Modal open={open} onClose={onClose}>
      <div className={styles.modalContainer}>
        <div className={styles.header}>
          <CustomArrowHeader title="Notification" onClose={onClose}>
            <button className={styles.settingBtn}>
              <img src={LineSetting.src} alt="setting" style={{width: 24, height: 24}} />
            </button>
          </CustomArrowHeader>
        </div>
        <div className={styles.tabContainer}>
          <SwipeTagList
            tags={tags}
            currentTag={tags[activeIndex]}
            onTagChange={tag => setActiveIndex(tags.indexOf(tag))}
          />
        </div>
        {activeIndex === 0 && <Notice />}
        {activeIndex === 1 && <Notice />}
        {activeIndex === 2 && <Notice />}
        {activeIndex === 3 && <Notice />}
      </div>
    </Modal>
  );
}
