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
    console.log("gdgd ", resProfileList);
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

    const feedInfoList = resProfileSelect.data?.data?.feedInfoList;
    const isMyProfile = resProfileSelect.data?.data?.isMyProfile;
    const profileInfo = resProfileSelect.data?.data?.profileInfo;

    return resProfileSelect.data?.data;

  } catch (e) {
    alert("api 에러" + e)
  }
}