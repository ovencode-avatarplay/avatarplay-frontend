import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {NotificationSystemType, NotificationContentType} from '@/app/NetWork/NotificationNetwork';

export interface Notification {
  id: string;
  message: string;
  type: string;
  hasUnread: boolean;
  createdAt: string;
  senderProfileUrlLinkKey: string;
  senderProfileIconUrl: string;
  contentType: NotificationContentType;
  systemType: NotificationSystemType;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  unread: boolean;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  unread: false,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
    },
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount += action.payload;
    },
    setUnread: (state, action: PayloadAction<boolean>) => {
      state.unread = action.payload;
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && notification.hasUnread) {
        notification.hasUnread = false;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    clearNotifications: state => {
      state.notifications = [];
      state.unreadCount = 0;
      state.unread = false;
    },
  },
});

export const {addNotification, setUnreadCount, setUnread, markAsRead, clearNotifications} = notificationSlice.actions;
export default notificationSlice.reducer;
