import axios, {AxiosResponse} from 'axios';
import api, {ResponseAPI} from './ApiInstance';
import {getCurrentLanguage} from '@/utils/UrlMove';
import {FeedInfo} from './ShortsNetwork';
import {CharacterIP, DeleteCharacterRes} from './CharacterNetwork';
import {ContentType} from './ContentNetwork';
import {InteractionType} from './CommonNetwork';

export interface GetProfileListRes {
  profileList: ProfileSimpleInfo[];
}

export interface ProfileSimpleInfo {
  profileId: number;
  profileTabType: ProfileTabType;
  operatorAuthorityType: OperatorAuthorityType;
  profileType: ProfileType;
  name: string;
  description?: string;
  iconImageUrl: string;
  nsfw: boolean;
  urlLinkKey: string;
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
  Favorites = 90,
  PlayList = 91,
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
    // alert('api 에러' + e);
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
  urlLinkKey: string;
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
  urlLinkKey: string;
  pdProfileUrlLinkKey: string;
  characterUrlLinkKey: string;
  characterIP: CharacterIP;
  subscriberCount: number;
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
  dislikeCount: number;
  mediaCount: number;
  contentCount: number;
  memberCount: number;
  playTime: string;
  isFavorite: boolean;
  characterIP: CharacterIP;
  sharedItemType: SharedItemType;
  createAt: string;
  isPinFix: boolean;
  urlLinkKey: string;
  contentType: ContentType;
}

export enum SharedItemType {
  None = 0,
  Character = 1,
  Channel = 2,
}

export enum MediaState {
  None = 0,
  Image = 1,
  Video = 2,
  Audio = 3,
}

export const getProfileInfo = async (urlLinkKey: string) => {
  const data: GetProfileInfoReq = {
    languageType: getCurrentLanguage(),
    urlLinkKey: urlLinkKey,
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
  contentTabType: ContentTabType;
  characterTabType: CharacterTabType;
  channelTabType: ChannelTabType;

  feedSortType: ExploreSortType;
  languageType: string;
  profileUrlLinkKey: string;
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
  sharedInfoList: ProfileTabItemInfo[];
}

export const getProfilePdTabInfo = async (
  profileUrlLinkKey = '',
  tabType: PdProfileTabType,
  feedSortType: ExploreSortType = ExploreSortType.Newest,
  filterType: {
    feedMediaType: number;
    channelTabType: number;
    characterTabType: number;
    contentTabType: number;
  } = {
    feedMediaType: 0,
    channelTabType: 0,
    characterTabType: 0,
    contentTabType: 0,
  },
  offset: number = 0,
  limit: number = 10,
) => {
  const data: GetPdTabInfoeReq = {
    feedSortType: feedSortType,
    channelTabType: filterType.channelTabType,
    characterTabType: filterType.characterTabType,
    contentTabType: filterType.contentTabType,
    feedMediaType: filterType.feedMediaType,
    languageType: getCurrentLanguage(),
    profileUrlLinkKey: profileUrlLinkKey,
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
  contentTabType: ContentTabType;
  characterTabType: CharacterTabType;
  channelTabType: ChannelTabType;
  feedSortType: ExploreSortType;
  languageType: string;
  profileUrlLinkKey: string;
  tabType: CharacterProfileTabType;
  page: PaginationRequest;
}

export enum ContentCategoryType {
  Webtoon,
  Video,
}

export enum CharacterTabType {
  Total,
  Original = 1,
  Fan = 2,
}

export enum ChannelTabType {
  Total,
  Original = 1,
  Fan = 2,
}

export enum ContentTabType {
  Total,
  Series = 1,
  Single = 2,
}

export enum CharacterProfileTabType {
  Feed = 0,
  Contents = 1,
  Story = 2,
  Character = 3,
  Game = 4,
}

export interface GetCharacterTabInfoeRes {
  feedInfoList: FeedInfo[];
  storyInfoList: ProfileTabItemInfo[];
  characterInfoList: ProfileTabItemInfo[];
  channelInfoList: ProfileTabItemInfo[];
  contentInfoList: ProfileTabItemInfo[];
}

export const getProfileCharacterTabInfo = async (
  profileUrlLinkKey: string = '',
  tabType: CharacterProfileTabType,
  feedSortType: ExploreSortType = ExploreSortType.Newest,
  filterType: {
    feedMediaType: number;
    channelTabType: number;
    characterTabType: number;
    contentTabType: number;
  } = {
    feedMediaType: 0,
    channelTabType: 0,
    characterTabType: 0,
    contentTabType: 0,
  },
  offset: number = 0,
  limit: number = 10,
) => {
  const data: GetCharacterTabInfoeReq = {
    feedMediaType: filterType.feedMediaType,
    channelTabType: 0,
    characterTabType: 0,
    contentTabType: 0,
    feedSortType: feedSortType,
    languageType: getCurrentLanguage(),
    profileUrlLinkKey: profileUrlLinkKey,
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
  imageUrl: string;
  createAt: Date;
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

export interface GetSubscriptionListReq {
  isValidSubscription: boolean;
}

export interface GetSubscriptionListRes {
  subscriptionList: MembershipSubscribe[];
}

export interface MembershipSubscribe {
  id: number;
  profileId: number;
  iconUrl: string;
  name: string;
  paymentType: PaymentType;
  paymentAmount: number;
  expireAt: string;
}

export enum PaymentType {
  USD,
  KRW,
  EUR,
  JPY,
  GBP,
}

export const getSubscriptionList = async (payload: GetSubscriptionListReq) => {
  try {
    const res = await api.post<ResponseAPI<GetSubscriptionListRes>>('Profile/getSubscriptionList', payload);

    if (res.status !== 200) {
      console.error('getSubscriptionList API 응답 오류:', res);
      return null;
    }

    return res.data;
  } catch (e) {
    console.error('getSubscriptionList API 요청 실패:', e);
    alert('API 요청 중 에러 발생: ' + e);
    return null;
  }
};

export interface GetSubscribePaymentReq {
  type: SubscriptionType;
  paymentProfileId: number;
}

export interface GetSubscribePaymentRes {
  paymentType: PaymentType;
  paymentAmount: number;
  benefit: string;
}

export enum SubscriptionType {
  Contents = 1,
  IP = 2,
}

export const getPaymentAmountMenu = async (payload: GetSubscribePaymentReq) => {
  try {
    const res = await api.post<ResponseAPI<GetSubscribePaymentRes>>('Profile/getSubscribePayment', payload);

    if (res.status !== 200) {
      console.error('getPaymentAmountMenu API 응답 오류:', res);
      return null;
    }

    return res.data;
  } catch (e) {
    console.error('getPaymentAmountMenu API 요청 실패:', e);
    alert('API 요청 중 에러 발생: ' + e);
    return null;
  }
};

export interface ProfileSubscribeReq {
  profileId: number;
}

export interface ProfileSubscribeRes {}

export const subscribeProfile = async (payload: ProfileSubscribeReq) => {
  try {
    const res = await api.post<ResponseAPI<ProfileSubscribeRes>>('Profile/subscribe', payload);

    if (res.status !== 200) {
      console.error('subscribeProfile API 응답 오류:', res);
      return null;
    }

    return res.data;
  } catch (e) {
    console.error('subscribeProfile API 요청 실패:', e);
    alert('API 요청 중 에러 발생: ' + e);
    return null;
  }
};

export interface SubscribeCancelReq {
  subscribeId: number;
}

export interface SubscribeCancelRes {
  subscribeId: number;
}

export const cancelSubscribe = async (payload: SubscribeCancelReq) => {
  try {
    const res = await api.post<ResponseAPI<SubscribeCancelRes>>('Profile/subscribeCancel', payload);

    if (res.status !== 200) {
      console.error('cancelSubscribe API 응답 오류:', res);
      return null;
    }

    return res.data;
  } catch (e) {
    console.error('cancelSubscribe API 요청 실패:', e);
    alert('API 요청 중 에러 발생: ' + e);
    return null;
  }
};

export interface GetConnectListReq {
  // empty
}

export const getConnectList = async (profileTabType: ProfileTabType = ProfileTabType.My) => {
  const data: GetConnectListReq = {
    profileTabType,
  };
  try {
    const resProfileList: AxiosResponse<ResponseAPI<GetProfileListRes>> = await api.post(
      `${process.env.NEXT_PUBLIC_CHAT_API_URL}/api/v1/Profile/getConnectList`,
      data,
    );
    if (resProfileList.status != 200) return;
    return resProfileList.data?.data?.profileList;
  } catch (e) {
    // alert('api 에러' + e);
  }
};

export interface DeleteProfileReq {
  profileId: number;
}

export const deleteProfile = async (payload: DeleteProfileReq) => {
  try {
    const res = await api.post<ResponseAPI<DeleteCharacterRes>>('Profile/delete', payload);

    if (res.status !== 200) {
      console.error('deleteProfile API 응답 오류:', res);
      return null;
    }

    return res.data;
  } catch (e) {
    console.error('deleteProfile API 요청 실패:', e);
    alert('API 요청 중 에러 발생: ' + e);
    return null;
  }
};

export interface GetBookMarkListReq {
  interactionType: InteractionType;
  languageType: string;
}

export interface GetBookMarkListRes {
  bookMarkInfoList: ProfileTabItemInfo[];
}

export const getBookmarkList = async (payload: GetBookMarkListReq) => {
  try {
    const res = await api.post<ResponseAPI<GetBookMarkListRes>>('Common/getBookMarkList', payload);

    if (res.status !== 200) {
      console.error('getBookmarkList API 응답 오류:', res);
      return null;
    }

    return res.data;
  } catch (e) {
    console.error('getBookmarkList API 요청 실패:', e);
    alert('API 요청 중 에러 발생: ' + e);
    return null;
  }
};

export interface GetRecordListReq {
  interactionType: InteractionType;
  languageType: string;
}

export interface GetRecordListRes {
  recordInfoList: ProfileTabItemInfo[];
}

export const getRecordList = async (payload: GetRecordListReq) => {
  try {
    const res = await api.post<ResponseAPI<GetRecordListRes>>('Common/getRecordList', payload);

    if (res.status !== 200) {
      console.error('getRecordList API 응답 오류:', res);
      return null;
    }

    return res.data;
  } catch (e) {
    console.error('getRecordList API 요청 실패:', e);
    alert('API 요청 중 에러 발생: ' + e);
    return null;
  }
};
