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
import {sendGetNotificationList, NotificationInfo, NotificationSystemType} from '@/app/NetWork/NotificationNetwork';

interface NotificationMainProps {
  open: boolean;
  onClose: () => void;
}

const tags = ['All', 'Request', 'Notice', 'System'];

export default function NotificationMain({open, onClose}: NotificationMainProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [notifications, setNotifications] = useState<NotificationInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await sendGetNotificationList({
        page: {
          offset: 0,
          limit: 20,
        },
      });
      if (response.data) {
        setNotifications(response.data.notificationList);
      }
    } catch (error) {
      console.error('알림 목록을 불러오는데 실패했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      dispatch(setUnread(false));
      fetchNotifications();
    }
  }, [open, dispatch]);

  const filteredNotifications = notifications.filter(notification => {
    if (activeIndex === 0) return true; // All
    return notification.systemType === activeIndex - 1;
  });

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
        {loading ? (
          <div className={styles.loading}>로딩 중...</div>
        ) : (
          filteredNotifications.map(notification => <Notice key={notification.id} notification={notification} />)
        )}
      </div>
    </Modal>
  );
}
