import api, {ResponseAPI} from './ApiInstance';
import {CharacterIP} from './CharacterNetwork';

export interface GetCharacterChatRoomListReq {
  isChatTag: boolean;
  characterIP: number;
  tag: string;
  sort: number;
  page: {
    offset: number;
    limit: number;
  };
  alreadyReceivedProfileIds: number[];
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
