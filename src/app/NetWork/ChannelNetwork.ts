import {CharacterIP, MembershipSetting, VisibilityType} from '@/redux-store/slices/ContentInfo';
import api, {ResponseAPI} from './ApiInstance';
import {ProfileSimpleInfo} from './ProfileNetwork';

export interface CreateChannelReq {
  channelInfo: ChannelInfo;
}

export interface CreateChannelRes {
  channelInfo: ChannelInfo;
}

export interface ChannelInfo {
  id: number;
  name: string;
  description: string;
  mediaUrl: string;
  memberProfileIdList: ProfileSimpleInfo[];
  visibilityType: VisibilityType;
  tag: string;
  characterIP: CharacterIP;
  operatorInvitationProfileIdList: ProfileSimpleInfo[];
  isMonetization: boolean;
  nSFW: boolean;
  postCountry: string[];
  membershipSetting: MembershipSetting;
  state: ChannelState;
  createAt: string;
  updateAt: string;
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
  } catch (e) {
    console.error('createUpdateChannel API 요청 실패:', e);
    alert('API 요청 중 에러 발생: ' + e);
    return null;
  }
};
