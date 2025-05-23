import React, {useState, useEffect} from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import styles from './NotificationMain.module.css';
import {LineCheck, LineClose, LineSetting} from '@ui/Icons';
import Notice from './Notice';
import SwipeTagList from '@/components/layout/shared/SwipeTagList';
import CustomArrowHeader from '@/components/layout/shared/CustomArrowHeader';
import {Settings} from '@mui/icons-material';
import {useDispatch} from 'react-redux';
import {setUnread} from '@/redux-store/slices/Notification';
import {sendGetNotificationList, NotificationInfo, NotificationSystemType, sendGetNewNotificationList, sendReadAllNotification, sendGetNotiReddot, sendReadNotification} from '@/app/NetWork/NotificationNetwork';
import {useSignalRContext} from '@/app/view/main/SignalREventInjector';


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
  const signalR = useSignalRContext();

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

  const fetchNewNotifications = async () => {
    try {
      const lastId = notifications.length > 0 ? notifications[0].id : 0;
      const response = await sendGetNewNotificationList({
        lastNotificationId: lastId,
        systemType: NotificationSystemType.All,
      });
      const notificationList = response?.data?.notificationList;
      if (notificationList && notificationList.length > 0) {
        setNotifications(prev => [...notificationList, ...prev]);
      }
    } catch (error) {
      console.error('새로운 알림을 불러오는데 실패했습니다:', error);
    }
  };

  const handleReadAll = async () => {
    try {
      await sendReadAllNotification();
      setNotifications(prev => prev.map(noti => ({ ...noti, isRead: true })));
    } catch (error) {
      console.error('모두 읽기 처리 중 오류:', error);
    }
  };

  const handleNotificationClick = async (notification: NotificationInfo) => {
    try {
      await sendReadNotification({ notificationId: notification.id });
      setNotifications(prev => prev.map(noti => noti.id === notification.id ? { ...noti, isRead: true } : noti));
    } catch (error) {
      console.error('알림 읽기 처리 중 오류:', error);
    }
  };

  useEffect(() => {
    if (open) {
      dispatch(setUnread(false));
      fetchNotifications();
      
      const interval = setInterval(fetchNewNotifications, 3000);
      return () => clearInterval(interval);
    }
  }, [open, dispatch]);

  const filteredNotifications = notifications.filter(notification => {
    switch (activeIndex) {
      case 0: // All
        return true;
      case 1: // Request
        return notification.systemType === NotificationSystemType.Request;
      case 2: // Notice
        return notification.systemType === NotificationSystemType.Notice;
      case 3: // System
        return notification.systemType === NotificationSystemType.System;
      default:
        return true;
    }
  });

  const handleClose = async () => {
    try {
      const response = await sendGetNotiReddot();
      if (response.data?.isNotifiactionReddot === true) {
       dispatch(setUnread(true));
      }
      if (response.data?.isNotifiactionReddot === false) {
        dispatch(setUnread(false));
        await signalR?.clearNotificationCache();
      }
    } catch (err) {
      console.error('알림 레드닷 상태 확인 중 오류:', err);
    } finally {
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div style={{height: '100dvh', backgroundColor: 'white'}}> 
      <div className={styles.modalContainer}>
        <div className={styles.header}>
          <CustomArrowHeader title="Notification" onClose={handleClose}>
            <button className={styles.allReadBtn} onClick={handleReadAll}>
              <span className={styles.checkIcon} aria-hidden="true" >
                <img src={LineCheck.src} alt="check" style={{width: 24, height: 24}} />
              </span>
              <span className={styles.allReadText}>모두읽음</span>
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
          filteredNotifications.map(notification => <Notice key={notification.id} notification={notification} onClick={() => handleNotificationClick(notification)} />)
        )}
      </div>
      </div>
    </Modal>
  );
}
