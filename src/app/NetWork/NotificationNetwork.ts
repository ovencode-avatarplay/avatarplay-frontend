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
}

// 알림 정보 타입
export interface NotificationInfo {
  id: number;
  senderProfileUrlLinkKey: string;
  systemType: NotificationSystemType; // enum 적용
  contentType: NotificationContentType; // enum 적용
  message: string;
  isRead: boolean;
  createdAt: string;
}

// 알림 목록 조회 응답 타입
export interface GetNotificationListRes {
  notificationList: NotificationInfo[];
}

/**
 * 알림 목록 조회 API
 * @param payload 페이지 정보 (offset, limit)
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
