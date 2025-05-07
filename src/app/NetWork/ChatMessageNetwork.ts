import api, {ResponseAPI} from './ApiInstance';
import {CharacterIP} from './CharacterNetwork';

export interface GetCharacterChatRoomListReq {
  isChatRoom: boolean;
  characterIP: number;
  tag: string;
  sort: number;
  page: {
    offset: number;
    limit: number;
  };
  alreadyReceivedProfileIds: number[];
  search: string;
}

export interface ChatRoomInfo {
  chatRoomId: number;
  profileImageUrl: string;
  urlLinkKey: string;
  characterProfileId: number;
  characterId: number;
  characterName: string;
  characterIP: number;
  likeCount: number;
  isPinFix: boolean;
  isUnreadDot: boolean;
  updatedAt: string;
}

export interface GetCharacterChatRoomListRes {
  chatRoomList: ChatRoomInfo[];
}

/**
 * 캐릭터 채팅방 리스트 가져오기
 * @param payload 요청 데이터
 * @returns API 응답 결과
 */
export const sendGetCharacterChatRoomList = async (
  payload: GetCharacterChatRoomListReq,
): Promise<ResponseAPI<GetCharacterChatRoomListRes>> => {
  try {
    const response = await api.post<ResponseAPI<GetCharacterChatRoomListRes>>(
      '/ChatMessage/getCharacterChatRoomList',
      payload,
    );

    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      throw new Error(`GetCharacterChatRoomListRes Error: ${response.data.resultCode}`);
    }
  } catch (error) {
    console.error('Failed to fetch chat room list:', error);
    throw new Error('Failed to fetch chat room list. Please try again.');
  }
};

export interface UrlEnterDMChatReq {
  urlLinkKey: string;
  chatRoomId: number;
}
export enum DMChatType {
  MyChat = 0,
  AnotherChat = 1,
}
export interface DMChatMessage {
  id: number;
  dmChatType: DMChatType;
  profileUrlLinkKey: string;
  profileImageUrl: string;
  profileName: string;
  message: string;
  mediaState: number;
  mediaUrl: string;
  emoticonId: number;
  createAt: string;
}

export interface UrlEnterDMChatRes {
  chatRoomId: number;
  anotherImageUrl: string;
  anotherProfileName: string;
  anotherProfileEmail: string;
  prevMessageInfoList: DMChatMessage[];
}

/**
 * DM 채팅방 입장 API
 * @param payload urlLinkKey와 chatRoomId 포함 요청 데이터
 * @returns 응답 데이터
 */
export const sendUrlEnterDMChat = async (payload: UrlEnterDMChatReq): Promise<ResponseAPI<UrlEnterDMChatRes>> => {
  try {
    const response = await api.post<ResponseAPI<UrlEnterDMChatRes>>('/ChatMessage/urlEnterDMChat', payload);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to enter DM chat:', error);
    throw new Error('DM 채팅방 입장 중 오류가 발생했습니다.');
  }
};

export interface GetDMChatRoomListReq {
  page: {
    offset: number;
    limit: number;
  };
}

// 개별 DM 채팅방 정보 타입
export interface DMChatRoomInfo {
  roomId: number;
  urlLinkKey: string;
  profileName: string;
  profileIconUrl: string;
  lastMessage: string;
  lastMessageAt: string;
}

// 응답 타입
export interface GetDMChatRoomListRes {
  dmChatRoomList: DMChatRoomInfo[];
}

/**
 * DM 채팅방 리스트 가져오기
 * @param payload 페이지 정보 (offset, limit)
 * @returns DM 채팅방 리스트 응답
 */
export const sendGetDMChatRoomList = async (
  payload: GetDMChatRoomListReq,
): Promise<ResponseAPI<GetDMChatRoomListRes>> => {
  try {
    const response = await api.post<ResponseAPI<GetDMChatRoomListRes>>('/ChatMessage/getDMChatRoomList', payload);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to fetch DM chat room list:', error);
    throw new Error('DM 채팅방 리스트 조회 중 오류가 발생했습니다.');
  }
};
