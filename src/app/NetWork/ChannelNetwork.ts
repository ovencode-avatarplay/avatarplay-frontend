import {MembershipSetting} from '@/app/NetWork/network-interface/CommonEnums';
import api, {ResponseAPI} from './ApiInstance';
import {CharacterIP} from './CharacterNetwork';
import {VisibilityType} from './ContentNetwork';
import {ExploreSortType, ProfileInfo, ProfileSimpleInfo} from './ProfileNetwork';
import {getCurrentLanguage} from '@/utils/UrlMove';

export interface CreateChannelReq {
  languageType: string;
  channelInfo: ChannelInfo;
}

export interface CreateChannelRes {
  channelProfileUrlLinkKey: string;
}

export interface ChannelInfo {
  id: number;
  name: string;
  description: string;
  mediaUrl: string;
  memberProfileIdList: ProfileSimpleInfo[];
  visibilityType: VisibilityType;
  tags: string[];
  characterIP: CharacterIP;
  operatorInvitationProfileIdList: ProfileSimpleInfo[];
  isMonetization: boolean;
  nsfw: boolean;
  postCountry: string[];
  membershipSetting?: MembershipSetting;
  state: ChannelState;
  createAt: string;
  updateAt: string;
  pdProfileSimpleInfo: ProfileSimpleInfo;

  isBookmark: boolean;
  isDisLike: boolean;
  isLike: boolean;
  likeCount: number;
}

export enum ChannelState {
  Delete = 0,
  Create = 1,
}

export const createUpdateChannel = async (payload: CreateChannelReq) => {
  try {
    const res = await api.post<ResponseAPI<CreateChannelRes>>('Channel/create', payload);

    if (res.status !== 200) {
      console.error('createUpdateChannel API 응답 오류:', res);
      return null;
    }

    return res.data;
  } catch (e: any) {
    console.error('createUpdateChannel API 요청 실패:', e.message);
    //alert('API 요청 중 에러 발생: ' + e);
    return null;
  }
};

export interface SearchChannelMemberReq {
  sortType: ExploreSortType;
  search: string;
}

export interface SearchChannelMemberRes {
  memberProfileList: ProfileSimpleInfo[];
}

export const sendSearchChannel = async (payload: SearchChannelMemberReq) => {
  try {
    const res = await api.post<ResponseAPI<SearchChannelMemberRes>>('channel/searchMemeber', payload);

    if (res.status !== 200) {
      console.error('sendSearchChannel API 응답 오류:', res);
      return null;
    }

    return res.data;
  } catch (e) {
    console.error('sendSearchChannel API 요청 실패:', e);
    return null;
  }
};

export interface GetChannelReq {
  channelProfileId: number;
}

export interface GetChannelRes {
  channelInfo: ChannelInfo;
}

export const getChannelInfo = async (payload: GetChannelReq) => {
  try {
    const res = await api.post<ResponseAPI<GetChannelRes>>('channel/get', payload);

    if (res.status !== 200) {
      console.error('getChannelInfo API 응답 오류:', res);
      return null;
    }

    return res.data;
  } catch (e) {
    console.error('getChannelInfo API 요청 실패:', e);
    return null;
  }
};

export interface DeleteChannelReq {
  channelId: number;
}

export interface DeleteChannelRes {}

export const deleteChannel = async (payload: DeleteChannelReq) => {
  try {
    const res = await api.post<ResponseAPI<DeleteChannelRes>>('channel/delete', payload);

    if (res.status !== 200) {
      console.error('deleteChannel API 응답 오류:', res);
      return null;
    }

    return res.data;
  } catch (e) {
    console.error('deleteChannel API 요청 실패:', e);
    return null;
  }
};
