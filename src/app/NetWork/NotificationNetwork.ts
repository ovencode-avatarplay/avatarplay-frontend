import api, {ResponseAPI} from './ApiInstance';

/**
 * 알림 시스템 타입
 */
export enum NotificationSystemType {
  /** 컨텐츠 알람 */
  Request = 0,
  /** 공지사항 */
  Notice = 1,
  /** 시스템 */
  System = 2,
  /** 전체 */
  All = 3,
}

/**
 * 알림 컨텐츠 타입
 */
export enum NotificationContentType {
  /** 친구 추가 */
  AddFriend = 10,
  /** 친구 수락 */
  AddFriendAccept = 11,
  /** 친구 거절 */
  AddFriendReject = 12,
}

// 알림 목록 조회 요청 타입
export interface GetNotificationListReq {
  page: {
    offset: number;
    limit: number;
  };
  systemType?: NotificationSystemType;
}

// 알림 정보 타입
export interface NotificationInfo {
  id: number;
  senderProfileUrlLinkKey: string;
  senderProfileIconUrl: string;
  systemType: NotificationSystemType;
  contentType: NotificationContentType;
  messageKey: string;
  messageValueList: string[];
  isRead: boolean;
  createdAt: string;
}

// 알림 목록 조회 응답 타입
export interface GetNotificationListRes {
  notificationList: NotificationInfo[];
}

// 새로운 알림 목록 조회 요청 타입
export interface GetNewNotificationListReq {
  lastNotificationId: number;
  systemType?: NotificationSystemType;
}

// 새로운 알림 목록 조회 응답 타입
export interface GetNewNotificationListRes {
  notificationList: NotificationInfo[];
}

// 알림 읽기 요청 타입
export interface ReadNotificationReq {
  notificationId: number;
}

// 알림 읽기 응답 타입
export interface ReadNotificationRes {}

// 모든 알림 읽기 요청 타입
export interface ReadAllNotificationReq {}

// 모든 알림 읽기 응답 타입
export interface ReadAllNotificationRes {}

// 알림 빨간점 요청 타입
export interface GetNotiReddotReq {}

// 알림 빨간점 응답 타입
export interface GetNotiReddotRes {
  isNotifiactionReddot: boolean;
}

// 친구 추가 처리 요청 타입
export interface ProcessAddFriendReq {
  notificationId: number;
  isAccepted: boolean;
}

// 친구 추가 처리 응답 타입
export interface ProcessAddFriendRes {
  notificationInfo: NotificationInfo;
}

/**
 * 알림 목록 조회 API
 * @param payload 페이지 정보 (offset, limit)와 시스템 타입
 * @returns 알림 목록 응답
 */
export const sendGetNotificationList = async (
  payload: GetNotificationListReq,
): Promise<ResponseAPI<GetNotificationListRes>> => {
  try {
    const response = await api.post<ResponseAPI<GetNotificationListRes>>('/Notification/getNotificationList', payload);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to fetch notification list:', error);
    throw new Error('알림 목록 조회 중 오류가 발생했습니다.');
  }
};

/**
 * 새로운 알림 목록 조회 API
 * @param payload 마지막 알림 ID와 시스템 타입
 * @returns 새로운 알림 목록 응답
 */
export const sendGetNewNotificationList = async (
  payload: GetNewNotificationListReq,
): Promise<ResponseAPI<GetNewNotificationListRes>> => {
  try {
    const response = await api.post<ResponseAPI<GetNewNotificationListRes>>('/Notification/getNewNotificationList', payload);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to fetch new notification list:', error);
    throw new Error('새로운 알림 목록 조회 중 오류가 발생했습니다.');
  }
};

/**
 * 알림 읽기 API
 * @param payload 알림 ID
 * @returns 읽기 처리 응답
 */
export const sendReadNotification = async (
  payload: ReadNotificationReq,
): Promise<ResponseAPI<ReadNotificationRes>> => {
  try {
    const response = await api.post<ResponseAPI<ReadNotificationRes>>('/Notification/readNotification', payload);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to read notification:', error);
    throw new Error('알림 읽기 처리 중 오류가 발생했습니다.');
  }
};

/**
 * 모든 알림 읽기 API
 * @returns 모든 알림 읽기 처리 응답
 */
export const sendReadAllNotification = async (): Promise<ResponseAPI<ReadAllNotificationRes>> => {
  try {
    const response = await api.post<ResponseAPI<ReadAllNotificationRes>>('/Notification/readAllNotification', {});
    return response.data;
  } catch (error) {
    console.error('❌ Failed to read all notifications:', error);
    throw new Error('모든 알림 읽기 처리 중 오류가 발생했습니다.');
  }
};

/**
 * 알림 빨간점 조회 API
 * @returns 알림 빨간점 상태 응답
 */
export const sendGetNotiReddot = async (): Promise<ResponseAPI<GetNotiReddotRes>> => {
  try {
    const response = await api.post<ResponseAPI<GetNotiReddotRes>>('/Notification/getNotiReddot', {});
    return response.data;
  } catch (error) {
    console.error('❌ Failed to get notification reddot:', error);
    throw new Error('알림 빨간점 조회 중 오류가 발생했습니다.');
  }
};

/**
 * 친구 추가 요청 처리 API
 * @param payload notificationId와 isAccepted 포함 요청 데이터
 * @returns 처리된 알림 정보 응답
 */
export const sendProcessAddFriend = async (payload: ProcessAddFriendReq): Promise<ResponseAPI<ProcessAddFriendRes>> => {
  try {
    const response = await api.post<ResponseAPI<ProcessAddFriendRes>>('/Notification/processAddFriend', payload);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to process add friend request:', error);
    throw new Error('친구 추가 요청 처리 중 오류가 발생했습니다.');
  }
};
