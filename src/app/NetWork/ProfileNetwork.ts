import axios, {AxiosResponse} from 'axios';
import api, {ResponseAPI} from './ApiInstance';
import {getCurrentLanguage} from '@/utils/UrlMove';
import {FeedInfo} from './ShortsNetwork';

export interface GetProfileListRes {
  profileList: ProfileSimpleInfo[];
}

export interface ProfileSimpleInfo {
  profileTabType: ProfileTabType;
  operatorAuthorityType: OperatorAuthorityType;
  profileId: number;
  profileType: ProfileType;
  name: string;
  iconImageUrl: string;
}

export enum OperatorAuthorityType {
  None = 0,
  Owner = 1,
  CanEdit = 2,
  OnlyComments = 3,
}

export enum ProfileType {
  User = 0,
  PD = 1,
  Character = 2,
  Channel = 3,
}

export interface GetMyProfileListReq {
  profileTabType: ProfileTabType;
}

export const getProfileList = async (profileTabType: ProfileTabType = ProfileTabType.My) => {
  const data: GetMyProfileListReq = {
    profileTabType,
  };
  try {
    const resProfileList: AxiosResponse<ResponseAPI<GetProfileListRes>> = await api.post(
      `${process.env.NEXT_PUBLIC_CHAT_API_URL}/api/v1/Profile/getMyList`,
      data,
    );
    if (resProfileList.status != 200) return;
    return resProfileList.data?.data?.profileList;
  } catch (e) {
    alert('api 에러' + e);
  }
};

export interface SelectProfileReq {
  profileTabType: ProfileTabType;
  profileId: number;
}

export enum ProfileTabType {
  My = 0,
  Shared = 1,
}

export interface SelectProfileRes {
  sessionInfo: SessionInfo;
  profileSimpleInfo: ProfileSimpleInfo;
}

export interface SessionInfo {
  name: string;
  accessToken: string;
}

export const selectProfile = async (profileId: number, profileTabType: ProfileTabType = ProfileTabType.My) => {
  const data: SelectProfileReq = {
    profileId: profileId,
    profileTabType: profileTabType,
  };
  try {
    const resProfileSelect: AxiosResponse<ResponseAPI<SelectProfileRes>> = await api.post(
      `${process.env.NEXT_PUBLIC_CHAT_API_URL}/api/v1/Profile/select`,
      data,
    );
    if (resProfileSelect.status != 200) return;

    return resProfileSelect.data?.data;
  } catch (e) {
    alert('api 에러' + e);
  }
};

export enum ExploreSortType {
  Newest,
  MostPopular,
  WeeklyPopular,
  MonthPopular,
}

export enum FeedMediaType {
  Total,
  Image = 1,
  Video = 2,
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
  typeValueId: number;
  pdProfileId: number;
  pdEmail: string;
  name: string;
  description: string;
  iconImageUrl: string;
  postCount: number;
  followerCount: number;
  followingCount: number;
  followState: FollowState;
}

export enum FollowState {
  UnFollow = 0,
  Follow = 1,
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
  isPinFix: boolean;
}

export enum MediaState {
  None = 0,
  Image = 1,
  Video = 2,
  Audio = 3,
}

export const getProfileInfo = async (profileId: number) => {
  const data: GetProfileInfoReq = {
    languageType: getCurrentLanguage(),
    profileId: profileId,
  };
  try {
    const resProfileSelect: AxiosResponse<ResponseAPI<GetProfileInfoRes>> = await api.post(
      `${process.env.NEXT_PUBLIC_CHAT_API_URL}/api/v1/Profile/get`,
      data,
    );
    if (resProfileSelect.status != 200) return;

    return resProfileSelect.data?.data;
  } catch (e) {
    alert('api 에러' + e);
  }
};
export interface GetPdTabInfoeReq {
  feedMediaType: FeedMediaType;
  feedSortType: ExploreSortType;
  languageType: string;
  profileId: number;
  tabType: PdProfileTabType;
  page: PaginationRequest;
}

export interface PaginationRequest {
  offset: number;
  limit: number;
}

export enum PdProfileTabType {
  Feed = 0,
  Channel = 1,
  Character = 2,
  Shared = 3,
}

export interface GetPdTabInfoeRes {
  feedInfoList: FeedInfo[];
  channelInfoList: ProfileTabItemInfo[];
  characterInfoList: ProfileTabItemInfo[];
}

export const getProfilePdTabInfo = async (
  profileId: number,
  tabType: PdProfileTabType,
  feedSortType: ExploreSortType = ExploreSortType.Newest,
  feedMediaType: FeedMediaType = FeedMediaType.Total,
  offset: number = 0,
  limit: number = 10,
) => {
  const data: GetPdTabInfoeReq = {
    feedSortType: feedSortType,
    feedMediaType: feedMediaType,
    languageType: getCurrentLanguage(),
    profileId: profileId,
    tabType: tabType,
    page: {
      offset: offset,
      limit: limit,
    },
  };
  try {
    const resProfileSelect: AxiosResponse<ResponseAPI<GetPdTabInfoeRes>> = await api.post(
      `${process.env.NEXT_PUBLIC_CHAT_API_URL}/api/v1/Profile/getPdTabInfo`,
      data,
    );
    if (resProfileSelect.status != 200) return;

    return resProfileSelect.data?.data;
  } catch (e) {
    alert('api 에러' + e);
  }
};

export interface GetCharacterTabInfoeReq {
  feedMediaType: FeedMediaType;
  feedSortType: ExploreSortType;
  languageType: string;
  profileId: number;
  tabType: CharacterProfileTabType;
  page: PaginationRequest;
}

export enum CharacterProfileTabType {
  Feed = 0,
  Contents = 1,
  Story = 2,
  Joined = 3,
}

export interface GetCharacterTabInfoeRes {
  feedInfoList: FeedInfo[];
  contentsInfoList: ProfileTabItemInfo[];
  storyInfoList: ProfileTabItemInfo[];
}

export const getProfileCharacterTabInfo = async (
  profileId: number,
  tabType: CharacterProfileTabType,
  feedSortType: ExploreSortType = ExploreSortType.Newest,
  feedMediaType: FeedMediaType = FeedMediaType.Total,
  offset: number = 0,
  limit: number = 10,
) => {
  const data: GetCharacterTabInfoeReq = {
    feedMediaType: feedMediaType,
    feedSortType: feedSortType,
    languageType: getCurrentLanguage(),
    profileId: profileId,
    tabType: tabType,
    page: {
      offset: offset,
      limit: limit,
    },
  };
  try {
    const resProfileSelect: AxiosResponse<ResponseAPI<GetCharacterTabInfoeRes>> = await api.post(
      `${process.env.NEXT_PUBLIC_CHAT_API_URL}/api/v1/Profile/getCharacterTabInfo`,
      data,
    );
    if (resProfileSelect.status != 200) return;

    return resProfileSelect.data?.data;
  } catch (e) {
    alert('api 에러' + e);
  }
};

export interface FollowProfileReq {
  followProfileId: number;
  isFollow: boolean;
}

export interface FollowProfileRes {
  resultCode: number;
  errorCode: string;
  resultMessage: string;
  data: {};
}

export const followProfile = async (profileId: number, isFollow: boolean) => {
  const data: FollowProfileReq = {
    followProfileId: profileId,
    isFollow: isFollow,
  };

  try {
    const res: AxiosResponse<ResponseAPI<FollowProfileRes>> = await api.post(
      `${process.env.NEXT_PUBLIC_CHAT_API_URL}/api/v1/Profile/follow`,
      data,
    );

    if (res.status !== 200) {
      console.error('Follow API 응답 오류:', res);
      return null;
    }

    return res.data?.data;
  } catch (e) {
    console.error('Follow API 요청 실패:', e);
    alert('API 요청 중 에러 발생: ' + e);
    return null;
  }
};

export interface InviteProfileReq {
  languageType: string;
  search: string;
  operatorAuthorityType: OperatorAuthorityType;
}

export interface InviteProfileRes {
  inviteProfileInfo: ProfileSimpleInfo;
}

export const sendInviteProfileReq = async (payload: InviteProfileReq) => {
  try {
    const res = await api.post<ResponseAPI<InviteProfileRes>>('Profile/invite', payload);

    if (res.status !== 200) {
      console.error('Follow API 응답 오류:', res);
      return null;
    }

    return res.data;
  } catch (e) {
    console.error('Follow API 요청 실패:', e);
    alert('API 요청 중 에러 발생: ' + e);
    return null;
  }
};

export interface SearchProfileReq {
  type: SearchProfileType;
  search: string;
}

export enum SearchProfileType {
  CreateCharacter = 0,
  CreateChannel = 1,
}

export interface SearchProfileRes {
  memberProfileList: ProfileInfo[];
}

export const sendSearchProfileReq = async (payload: SearchProfileReq) => {
  try {
    const res = await api.post<ResponseAPI<SearchProfileRes>>('Profile/search', payload);

    if (res.status !== 200) {
      console.error('Follow API 응답 오류:', res);
      return null;
    }

    return res.data;
  } catch (e) {
    console.error('Follow API 요청 실패:', e);
    alert('API 요청 중 에러 발생: ' + e);
    return null;
  }
};

export interface UpdatePdInfoReq {
  profileId: number;
  name: string;
  iconUrl: string;
  introduce: string;
  interests: string[];
  skills: string[];
  personalHistory: string;
  honorAwards: string;
  url: string;
  pdPortfolioInfoList: PdPortfolioInfo[];
}

export interface PdPortfolioInfo {
  id: number;
  description: string;
  image_url: string;
}

export interface UpdatePdInfoRes {}

export const updatePdInfo = async (payload: UpdatePdInfoReq) => {
  try {
    const res = await api.post<ResponseAPI<UpdatePdInfoRes>>('Profile/updatePdInfo', payload);

    if (res.status !== 200) {
      console.error('UpdatePDInfo API 응답 오류:', res);
      return null;
    }

    return res.data;
  } catch (e) {
    console.error('UpdatePDInfo API 요청 실패:', e);
    alert('API 요청 중 에러 발생: ' + e);
    return null;
  }
};

export interface GetPdInfoReq {
  profileId: number;
}

export interface GetPdInfoRes {
  profileId: number;
  name: string;
  iconUrl: string;
  introduce: string;
  interests: string[];
  skills: string[];
  personalHistory: string;
  honorAwards: string;
  url: string;
  pdPortfolioInfoList: PdPortfolioInfo[];
}

export const getPdInfo = async (payload: GetPdInfoReq) => {
  try {
    const res = await api.get<ResponseAPI<GetPdInfoRes>>('Profile/getPdInfo/' + `?profileId=${payload.profileId}`);

    if (res.status !== 200) {
      console.error('getPdInfo API 응답 오류:', res);
      return null;
    }

    return res.data;
  } catch (e) {
    console.error('getPdInfo API 요청 실패:', e);
    alert('API 요청 중 에러 발생: ' + e);
    return null;
  }
};
