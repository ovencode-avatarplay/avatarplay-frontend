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
}
export enum DMChatType {
  MyChat = 0,
  AnotherChat = 1,
}

export enum MediaState {
  None = 0,
  Image = 1,
  Video = 2,
  Audio = 3,
}

export enum ChatState {
  Create = 1,
  Delete = 2,
}
export interface DMChatMessage {
  id: number;
  dmChatType: DMChatType;
  profileUrlLinkKey: string;
  profileImageUrl: string;
  profileName: string;
  message: string;
  mediaState: MediaState;
  mediaUrl: string;
  emoticonId: number;
  chatState: ChatState;
  createAt: string;
}

export interface UrlEnterDMChatRes {
  anotherImageUrl: string;
  anotherProfileName: string;
  anotherProfileEmail: string;
  prevMessageInfoList: DMChatMessage[];
  roomId: number;
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
  isDMChatRoom: boolean;
  search: string;
  interest: string;
  sort: number;
  page: {
    offset: number;
    limit: number;
  };
  alreadyReceivedProfileIds: number[];
}

// 개별 DM 채팅방 정보 타입
export interface DMChatRoomInfo {
  roomId: number;
  urlLinkKey: string;
  profileName: string;
  profileIconUrl: string;
  lastMessage: string;
  lastMessageAt: string;
  isPinFix: boolean;
}

// 응답 타입
export interface GetDMChatRoomListRes {
  dmChatRoomList: DMChatRoomInfo[];
  dmChatRecommendProfileList: SearchCharacterRoomInfo[];
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

// 요청 타입
export interface CheckDMChatLinkKeyReq {
  profileUrlLinkKey: string;
}

// 응답 타입
export interface CheckDMChatLinkKeyRes {
  dmChatUrlLinkKey: string;
}

/**
 * 특정 프로필의 DM 채팅 링크 키 확인
 * @param payload profileUrlLinkKey 포함 요청 객체
 * @returns dmChatUrlLinkKey 응답
 */
export const sendCheckDMChatLinkKey = async (
  payload: CheckDMChatLinkKeyReq,
): Promise<ResponseAPI<CheckDMChatLinkKeyRes>> => {
  try {
    const response = await api.post<ResponseAPI<CheckDMChatLinkKeyRes>>('/ChatMessage/checkDMChatLinkKey', payload);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to check DM chat link key:', error);
    throw new Error('DM 채팅 링크 키 확인 중 오류가 발생했습니다.');
  }
};

export interface GetSearchCharacterRoomListReq {
  characterIP: number;
  search: string;
  positiveFilterTags: string[];
  nagativeFilterTags: string[];
  isAdults: boolean;
}

export interface SearchCharacterRoomInfo {
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

export interface GetSearchCharacterRoomListRes {
  followBackCharacterList: SearchCharacterRoomInfo[];
  recommendCharacterList: SearchCharacterRoomInfo[];
}

/**
 * 캐릭터 채팅방 검색 API
 * @param payload 검색 조건을 포함한 요청 데이터
 * @returns 검색된 캐릭터 채팅방 리스트 응답
 */
export const sendGetSearchCharacterRoomList = async (
  payload: GetSearchCharacterRoomListReq,
): Promise<ResponseAPI<GetSearchCharacterRoomListRes>> => {
  try {
    const response = await api.post<ResponseAPI<GetSearchCharacterRoomListRes>>(
      '/ChatMessage/getSearchCharacterRoomList',
      payload,
    );
    return response.data;
  } catch (error) {
    console.error('❌ Failed to search character rooms:', error);
    throw new Error('캐릭터 채팅방 검색 중 오류가 발생했습니다.');
  }
};

// 팔로우 리스트 검색
export interface GetSearchFollowingListReq {
  characterIP: number;
  search: string;
  positiveFilterTags: string[];
  nagativeFilterTags: string[];
  isAdults: boolean;
  page: {
    offset: number;
    limit: number;
  };
  alreadyReceivedProfileIds: number[];
}
export interface GetSearchFollowingListRes {
  followCharacterList: SearchCharacterRoomInfo[];
}
export const sendGetSearchFollowingList = async (
  payload: GetSearchFollowingListReq,
): Promise<ResponseAPI<GetSearchFollowingListRes>> => {
  try {
    const response = await api.post<ResponseAPI<GetSearchFollowingListRes>>(
      '/ChatMessage/getSearchFollowingList',
      payload,
    );
    return response.data;
  } catch (error) {
    console.error('❌ Failed to search following list:', error);
    throw new Error('팔로우 리스트 검색 중 오류가 발생했습니다.');
  }
};

// 캐릭터 추천 리스트 검색
export interface GetSearchCharacterListReq {
  characterIP: number;
  search: string;
  positiveFilterTags: string[];
  nagativeFilterTags: string[];
  isAdults: boolean;
  page: {
    offset: number;
    limit: number;
  };
  alreadyReceivedProfileIds: number[];
}
export interface GetSearchCharacterListRes {
  recommendCharacterList: SearchCharacterRoomInfo[];
}
export const sendGetSearchCharacterList = async (
  payload: GetSearchCharacterListReq,
): Promise<ResponseAPI<GetSearchCharacterListRes>> => {
  try {
    const response = await api.post<ResponseAPI<GetSearchCharacterListRes>>(
      '/ChatMessage/getSearchCharacterList',
      payload,
    );
    return response.data;
  } catch (error) {
    console.error('❌ Failed to search character list:', error);
    throw new Error('캐릭터 추천 리스트 검색 중 오류가 발생했습니다.');
  }
};

// 친구 리스트 검색
export interface GetSearchFriendListReq {
  search: string;
  page: {
    offset: number;
    limit: number;
  };
  alreadyReceivedProfileIds: number[];
}
export interface GetSearchFriendListRes {
  friendList: SearchCharacterRoomInfo[];
}
export const sendGetSearchFriendList = async (
  payload: GetSearchFriendListReq,
): Promise<ResponseAPI<GetSearchFriendListRes>> => {
  try {
    const response = await api.post<ResponseAPI<GetSearchFriendListRes>>('/ChatMessage/getSearchFriendList', payload);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to search friend list:', error);
    throw new Error('친구 리스트 검색 중 오류가 발생했습니다.');
  }
};

// 친구 추천 리스트 검색
export interface GetSearchPeopleListReq {
  search: string;
  page: {
    offset: number;
    limit: number;
  };
  alreadyReceivedProfileIds: number[];
}
export interface GetSearchPeopleListRes {
  recommendPeopleList: SearchCharacterRoomInfo[];
}
export const sendGetSearchPeopleList = async (
  payload: GetSearchPeopleListReq,
): Promise<ResponseAPI<GetSearchPeopleListRes>> => {
  try {
    const response = await api.post<ResponseAPI<GetSearchPeopleListRes>>('/ChatMessage/getSearchPeopleList', payload);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to search people list:', error);
    throw new Error('친구 추천 리스트 검색 중 오류가 발생했습니다.');
  }
};

// 친구 추가 요청 타입
export interface AddFriendReq {
  addFriendProfileId: number;
}

// 친구 추가 응답 타입
export interface AddFriendRes {
  friendProfileId: number;
}

/**
 * 친구 추가 API
 * @param payload addFriendProfileId 포함 요청 데이터
 * @returns friendProfileId 응답
 */
export const sendAddFriend = async (payload: AddFriendReq): Promise<ResponseAPI<AddFriendRes>> => {
  try {
    const response = await api.post<ResponseAPI<AddFriendRes>>('/ChatMessage/addFriend', payload);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to add friend:', error);
    throw new Error('친구 추가 중 오류가 발생했습니다.');
  }
};

// 친구 추가 취소 요청 타입
export interface CancelAddFriendReq {
  canceledProfileId: number;
}

// 친구 추가 취소 응답 타입
export interface CancelAddFriendRes {
  canceledProfileId: number;
}

/**
 * 친구 추가 취소 API
 * @param payload canceledProfileId 포함 요청 데이터
 * @returns canceledProfileId 응답
 */
export const sendCancelAddFriend = async (payload: CancelAddFriendReq): Promise<ResponseAPI<CancelAddFriendRes>> => {
  try {
    const response = await api.post<ResponseAPI<CancelAddFriendRes>>('/ChatMessage/cancelAddFriend', payload);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to cancel add friend:', error);
    throw new Error('친구 추가 취소 중 오류가 발생했습니다.');
  }
};

// 채팅방 읽음 처리 요청 타입
export interface ReadChatRoomReq {
  roomId: number;
}

// 채팅방 읽음 처리 응답 타입
export interface ReadChatRoomRes {
  // 빈 객체 반환
}

/**
 * 채팅방 읽음 처리 API
 * @param payload roomId 포함 요청 데이터
 * @returns 빈 객체 응답
 */
export const sendReadChatRoom = async (payload: ReadChatRoomReq): Promise<ResponseAPI<ReadChatRoomRes>> => {
  try {
    const response = await api.post<ResponseAPI<ReadChatRoomRes>>('/ChatMessage/read', payload);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to read chat room:', error);
    throw new Error('채팅방 읽음 처리 중 오류가 발생했습니다.');
  }
};

// 채팅방 타입 enum
export enum ChatRoomType {
  None = 0,
  Character = 1,
  DM = 2,
}

// 채팅방 나가기 요청 타입
export interface LeaveChatRoomReq {
  chatRoomType: ChatRoomType;
  dmRoomId: number;
  characterUrlLinkKey: string;
}

// 채팅방 나가기 응답 타입
export interface LeaveChatRoomRes {
  chatRoomType: ChatRoomType;
  dmRoomId: number;
  characterUrlLinkKey: string;
}

/**
 * 채팅방 나가기 API
 * @param payload chatRoomType, dmRoomId, characterUrlLinkKey 포함 요청 데이터
 * @returns 채팅방 정보 응답
 */
export const sendLeaveChatRoom = async (payload: LeaveChatRoomReq): Promise<ResponseAPI<LeaveChatRoomRes>> => {
  try {
    const response = await api.post<ResponseAPI<LeaveChatRoomRes>>('/ChatMessage/leave', payload);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to leave chat room:', error);
    throw new Error('채팅방 나가기 중 오류가 발생했습니다.');
  }
};
