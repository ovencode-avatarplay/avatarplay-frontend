import axios, { AxiosResponse } from 'axios';
import api, { ResponseAPI } from './ApiInstance';
import { getCurrentLanguage } from '@/utils/UrlMove';

export interface GetProfileListRes {
  profileList: ProfileSimpleInfo[];
}

export interface ProfileSimpleInfo {
  id: number;
  type: ProfileType;
  name: string;
  iconImageUrl: string;
}

export enum ProfileType {
  User = 0,
  PD = 1,
  Character = 2,
  Channel = 3
}

export const getProfileList = async () => {
  const data = {

  };
  try {
    const resProfileList: AxiosResponse<ResponseAPI<GetProfileListRes>> = await api.post(`${process.env.NEXT_PUBLIC_CHAT_API_URL}/api/v1/Profile/getMyList`, {});
    if (resProfileList.status != 200) return;
    return resProfileList.data?.data?.profileList;

  } catch (e) {
    alert("api 에러" + e)
  }
}

export interface SelectProfileReq {
  profileId: number;
}

export interface SelectProfileRes {
  sessionInfo: SessionInfo;
  profileSimpleInfo: ProfileSimpleInfo;
}

export interface SessionInfo {
  name: string;
  accessToken: string;
}

export interface ProfileSimpleInfo {
  id: number;
  type: ProfileType;
  name: string;
  iconImageUrl: string;
}

export const selectProfile = async (profileId: number) => {
  const data: SelectProfileReq = {
    profileId: profileId,
  };
  try {
    const resProfileSelect: AxiosResponse<ResponseAPI<SelectProfileRes>> = await api.post(`${process.env.NEXT_PUBLIC_CHAT_API_URL}/api/v1/Profile/select`, data);
    if (resProfileSelect.status != 200) return;

    return resProfileSelect.data?.data;

  } catch (e) {
    alert("api 에러" + e)
  }
}

export interface GetProfileInfoReq {
  languageType: string;
  profileId: number;
}

export interface GetProfileInfoRes {
  isMyProfile: boolean;
  profileInfo: ProfileInfo;
  feedInfoList: ProfileTabItemInfo[];
}

export interface ProfileInfo {
  id: number;
  type: ProfileType;
  name: string;
  description: string;
  iconImageUrl: string;
  postCount: number;
  followerCount: number;
  followingCount: number;
}

export interface ProfileTabItemInfo {
  id: number;
  name: string;
  mediaState: MediaState;
  mediaUrl: string;
  likeCount: number;
  mediaCount: number;
  playTime: string;
  isFavorite: boolean;
}

export interface GetProfileInfoReq {
  languageType: string;
  profileId: number;
}

export interface GetProfileInfoRes {
  isMyProfile: boolean;
  profileInfo: ProfileInfo;
  feedInfoList: ProfileTabItemInfo[];
}

export interface ProfileInfo {
  id: number;
  type: ProfileType;
  name: string;
  description: string;
  iconImageUrl: string;
  postCount: number;
  followerCount: number;
  followingCount: number;
}

export interface ProfileTabItemInfo {
  id: number;
  name: string;
  mediaState: MediaState;
  mediaUrl: string;
  likeCount: number;
  mediaCount: number;
  playTime: string;
  isFavorite: boolean;
}

export enum MediaState {
  None = 0,
  Image = 1,
  Video = 2,
  Audio = 3
}


export const getProfileInfo = async (profileId: number) => {
  const data: GetProfileInfoReq = {
    languageType: getCurrentLanguage(),
    profileId: profileId,
  };
  try {
    const resProfileSelect: AxiosResponse<ResponseAPI<GetProfileInfoRes>> = await api.post(`${process.env.NEXT_PUBLIC_CHAT_API_URL}/api/v1/Profile/get`, data);
    if (resProfileSelect.status != 200) return;

    return resProfileSelect.data?.data;

  } catch (e) {
    alert("api 에러" + e)
  }

}
export interface GetPdTabInfoeReq {
  languageType: string;
  profileId: number;
  tabType: PdProfileTabType;
}

export enum PdProfileTabType {
  Feed = 0,
  Channel = 1,
  Character = 2,
  Shared = 3
}
export interface GetPdTabInfoeRes {
  tabInfoList: ProfileTabItemInfo[];
}

export interface ProfileTabItemInfo {
  id: number;
  name: string;
  mediaState: MediaState;
  mediaUrl: string;
  likeCount: number;
  mediaCount: number;
  playTime: string;
  isFavorite: boolean;
}

export const getProfilePdTabInfo = async (profileId: number, tabType: PdProfileTabType) => {
  const data: GetPdTabInfoeReq = {
    languageType: getCurrentLanguage(),
    profileId: profileId,
    tabType: tabType
  };
  try {
    const resProfileSelect: AxiosResponse<ResponseAPI<GetPdTabInfoeRes>> = await api.post(`${process.env.NEXT_PUBLIC_CHAT_API_URL}/api/v1/Profile/getPdTabInfo`, data);
    if (resProfileSelect.status != 200) return;

    return resProfileSelect.data?.data;

  } catch (e) {
    alert("api 에러" + e)
  }
}

export interface GetCharacterTabInfoeReq {
  languageType: string;
  profileId: number;
  tabType: CharacterProfileTabType;
}

export enum CharacterProfileTabType {
  Feed = 0,
  Contents = 1,
  Story = 2,
  Joined = 3
}

export interface GetCharacterTabInfoeRes {
  tabInfoList: ProfileTabItemInfo[];
}

export interface ProfileTabItemInfo {
  id: number;
  name: string;
  mediaState: MediaState;
  mediaUrl: string;
  likeCount: number;
  mediaCount: number;
  playTime: string;
  isFavorite: boolean;
}

export const getProfileCharacterTabInfo = async (profileId: number, tabType: CharacterProfileTabType) => {
  const data: GetCharacterTabInfoeReq = {
    languageType: getCurrentLanguage(),
    profileId: profileId,
    tabType: tabType
  };
  try {
    const resProfileSelect: AxiosResponse<ResponseAPI<GetCharacterTabInfoeRes>> = await api.post(`${process.env.NEXT_PUBLIC_CHAT_API_URL}/api/v1/Profile/getCharacterTabInfo`, data);
    if (resProfileSelect.status != 200) return;

    return resProfileSelect.data?.data;

  } catch (e) {
    alert("api 에러" + e)
  }
}