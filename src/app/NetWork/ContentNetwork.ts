// src/app/Network/ContentNetwork.ts

import {en} from '@supabase/auth-ui-shared';
import api, {ResponseAPI} from './ApiInstance';
import {AxiosError} from 'axios';
import {MediaState} from './ProfileNetwork';
export enum ContentState {
  Create,
  Delete,
  Upload,
}
export enum ContentEpisodeState {
  Create,
  Delete,
  Upload,
}
// 📌 Content 생성 요청
export interface CreateContentReq {
  contentInfo: CreateContentInfo;
}

export interface ContentInfo {
  id?: number; // 콘텐츠 ID (선택적, 생성 전에는 없음)
  profileId: number;
  maxSeasonNo: number;
  contentType: number;
  thumbnailUrl: string;
  name: string;
  oneLineSummary: string;
  description: string;
  categoryType: number;
  genre: string;
  tags: string[];
  postCountry: string[];
  visibility: number;
  nsfw: boolean;
  monetization: boolean;
  salesStarEa: number;
  contentWebtoonInfo?: ContentEpisodeWebtoonInfo;
  contentVideoInfo?: ContentEpisodeVideoInfo;
  urlLinkKey?: string;
  thumbnailMediaState?: MediaState;
  state: ContentState;
}
export interface CreateContentInfo {
  id?: number; // 콘텐츠 ID (선택적, 생성 전에는 없음)
  profileId: number;
  maxSeasonNo: number;
  contentType: number;
  thumbnailUrl: string;
  name: string;
  oneLineSummary: string;
  description: string;
  categoryType: number;
  genre: string;
  tags: string[];
  postCountry: string[];
  visibility: number;
  nsfw: boolean;
  monetization: boolean;
  salesStarEa: number;
  contentWebtoonInfo?: ContentEpisodeWebtoonInfo;
  contentVideoInfo?: CreateContentEpisodeVideoInfo;
  urlLinkKey?: string;
  thumbnailMediaState?: MediaState;
}

export interface CreateContentRes {
  contentId: number;
  urlLinkKey: string;
}

export const sendCreateContent = async (payload: CreateContentReq): Promise<ResponseAPI<CreateContentRes>> => {
  try {
    const response = await api.post<ResponseAPI<CreateContentRes>>('/Content/create', payload);
    if (response.data.resultCode === 0) return response.data;
    throw new Error(`CreateContentRes Error: ${response.data.resultCode}`);
  } catch (error) {
    console.error('Error sending create content:', error);
    throw new Error('Failed to create content. Please try again.');
  }
};

// 📌 Content 조회 요청
export interface GetContentReq {
  urlLinkKey: string;
}

export interface GetContentRes {
  profileUrlLinkKey: string;
  contentInfo: ContentInfo;
  isSingleContentLock: boolean;
  isMyContent: boolean;
  profileName: string;
}

export const sendGetContent = async (payload: GetContentReq): Promise<ResponseAPI<GetContentRes>> => {
  try {
    const response = await api.post<ResponseAPI<GetContentRes>>('/Content/get', payload);
    if (response.data.resultCode === 0) return response.data;
    throw new Error(`GetContentRes Error: ${response.data.resultCode}`);
  } catch (error) {
    console.error('Error fetching content:', error);
    throw new Error('Failed to fetch content. Please try again.');
  }
};
// 📌 에피소드 생성 요청
export interface CreateEpisodeReq {
  episodeInfo: CreateContentEpisodeInfo;
}

// 📌 콘텐츠 에피소드 정보
export interface ContentEpisodeInfo {
  id?: number;
  contentId: number;
  seasonNo: number;
  episodeNo: number;
  thumbnailUrl: string;
  name: string;
  description: string;
  monetization: boolean;
  salesStarEa: number;
  likeCount: number;
  episodeVideoInfo?: ContentEpisodeVideoInfo;
  episodeWebtoonInfo?: ContentEpisodeWebtoonInfo;
}

export interface CreateContentEpisodeInfo {
  id?: number;
  contentId: number;
  seasonNo: number;
  episodeNo: number;
  thumbnailUrl: string;
  name: string;
  description: string;
  monetization: boolean;
  salesStarEa: number;
  likeCount: number;
  episodeVideoInfo?: CreateContentEpisodeVideoInfo;
  episodeWebtoonInfo?: ContentEpisodeWebtoonInfo;
}

export enum ContentLanguageType {
  Korean = 0,
  English = 1,
  Japanese = 2,
  French = 3,
  Spanish = 4,
  ChineseSimplified = 5,
  ChineseTraditional = 6,
  Portuguese = 7,
  German = 8,
  Source = 100,
  Default = 200,
}
// 📌 에피소드 비디오 정보
export interface ContentEpisodeVideoInfo {
  mpdTempUrl: string;
  videoSourceFileInfo: VideoFileInfo;
  subTitleFileInfos: VideoFileInfo[];
  dubbingFileInfos: VideoFileInfo[];
}
export interface CreateContentEpisodeVideoInfo {
  videoSourceFileInfo: CreateVideoFileInfo;
  subTitleFileInfos: VideoFileInfo[];
  dubbingFileInfos: CreateVideoFileInfo[];
}
export interface CreateVideoFileInfo {
  videoLanguageType: ContentLanguageType;
  tempFileName: string; // ✅ 새 필드
  videoFileName: string; // ✅ 새 필드
}

export interface VideoFileInfo {
  videoLanguageType: ContentLanguageType;
  videoSourceUrl: string;
  videoSourceName: string;
  videoTempFileName?: string;
}

// 📌 새로운 에피소드 웹툰 정보 (변경됨)
export interface ContentEpisodeWebtoonInfo {
  likeCount: number;
  webtoonSourceUrlList: WebtoonSourceUrl[];
}

// 📌 웹툰 언어별 소스 리스트
export interface WebtoonSourceUrl {
  webtoonLanguageType: ContentLanguageType;
  webtoonSourceUrls: string[];
  webtoonSourceNames: string[];
}

// 📌 에피소드 생성 응답
export interface CreateEpisodeRes {
  episodeId: number;
}

// 📌 에피소드 생성 API 호출
export const sendCreateEpisode = async (payload: CreateEpisodeReq): Promise<ResponseAPI<CreateEpisodeRes>> => {
  try {
    const response = await api.post<ResponseAPI<CreateEpisodeRes>>('/Content/createEpisode', payload);
    if (response.data.resultCode === 0) return response.data;
    throw new Error(`CreateEpisodeRes Error: ${response.data.resultCode}`);
  } catch (error) {
    console.error('Error creating episode:', error);
    throw new Error('Failed to create episode. Please try again.');
  }
};
export interface GetEpisodeReq {
  episodeId: number;
}

export interface GetEpisodeRes {
  episodeInfo: ContentEpisodeInfo;
}
// 📌 에피소드 조회 API 호출
export const sendGetEpisode = async (payload: GetEpisodeReq): Promise<ResponseAPI<GetEpisodeRes>> => {
  try {
    const response = await api.post<ResponseAPI<GetEpisodeRes>>('/Content/getEpisode', payload);
    if (response.data.resultCode === 0) return response.data;
    throw new Error(`GetEpisodeRes Error: ${response.data.resultCode}`);
  } catch (error) {
    console.error('Error fetching episode:', error);
    throw new Error('Failed to fetch episode. Please try again.');
  }
};

// 📌 시즌 번호 업데이트
export interface UpdateSeasonNoReq {
  contentId: number;
  seasonNo: number;
}

export interface UpdateSeasonNoRes {
  contentId: number;
  updatedSeasonNo: number;
}

export const sendAddSeasonNo = async (payload: UpdateSeasonNoReq): Promise<ResponseAPI<UpdateSeasonNoRes>> => {
  try {
    const response = await api.post<ResponseAPI<UpdateSeasonNoRes>>('/Content/addSeasonNo', payload);
    if (response.data.resultCode === 0) return response.data;
    throw new Error(`UpdateSeasonNoRes Error: ${response.data.resultCode}`);
  } catch (error) {
    console.error('Error updating season number:', error);
    throw new Error('Failed to update season number. Please try again.');
  }
};

// 📌 시즌 삭제 요청 타입
export interface DeleteSeasonNoReq {
  contentId: number;
  deleteSeasonNo: number;
}

// 📌 시즌 삭제 응답 타입
export interface DeleteSeasonNoRes {
  contentId: number;
  deleteSeasonNo: number;
  lastSeasonNo: number; // 삭제 후 남은 마지막 시즌 번호
}

// 📌 시즌 삭제 API 호출 함수
export const sendDeleteSeasonNo = async (payload: DeleteSeasonNoReq): Promise<ResponseAPI<DeleteSeasonNoRes>> => {
  try {
    const response = await api.post<ResponseAPI<DeleteSeasonNoRes>>('/Content/deleteSeasonNo', payload);

    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      throw new Error(`DeleteSeasonNoRes Error: ${response.data.resultCode}`);
    }
  } catch (error) {
    console.error('Error deleting season:', error);
    throw new Error('Failed to delete season. Please try again.');
  }
};

// 📌 특정 시즌의 에피소드 리스트 가져오기
export interface GetSeasonEpisodesReq {
  urlLinkKey: string;
  seasonNo: number;
}

export interface SeasonEpisodeInfo {
  episodeId: number;
  episodeNo: number;
  episodeName: string;
  thumbnailUrl: string;
  salesStarEa: number;
  isLock: boolean;
  thumbnailMediaState?: MediaState;
  episodeVideoInfo: ContentEpisodeVideoInfo;
  episodeWebtoonInfo: ContentEpisodeWebtoonInfo;
  episodeState: ContentEpisodeState;
}

export interface GetSeasonEpisodesRes {
  contentId: number;
  contentThumbnailUrl: string;
  contentName: string;
  seasonNo: number;
  genre: string;
  tags: string[];
  maxSeasonNo: number;
  description: string;
  isBookMark: boolean;
  profileUrlLinkKey: string;
  episodeList: SeasonEpisodeInfo[];
  isMyContent: boolean;
  profileId: number;
  profileName: string;
  thumbnailMediaState: MediaState;
  isProfileSubscribe: boolean;
  contentCategoryType: number;
}

export const sendGetSeasonEpisodes = async (
  payload: GetSeasonEpisodesReq,
): Promise<ResponseAPI<GetSeasonEpisodesRes>> => {
  try {
    const response = await api.post<ResponseAPI<GetSeasonEpisodesRes>>('/Content/getSeasonEpisodes', payload);
    // if (response.data.resultCode === 0)
    return response.data;
    // throw new Error(`GetSeasonEpisodesRes Error: ${response.data.resultCode}`);
  } catch (error) {
    console.error('Error fetching season episodes:', error);
    throw new Error('Failed to fetch season episodes. Please try again.');
  }
};

// 📌 특정 프로필의 콘텐츠 리스트 가져오기
export interface GetContentListReq {
  profileId: number;
  contentType: ContentType;
}

export interface ContentListInfo {
  id: number;
  urlLinkKey: string;
  name: string;
  description: string;
  genre: string;
  thumbnailUrl: string;
  episodeCount: number;
  visibility: number;
  subscriberCount: number;
  categoryType: ContentCategoryType;
  tags: string[];
  createAt: Date;
  state: ContentState;
}

export enum ContentCategoryType {
  Webtoon = 0,
  Video = 1,
}

export enum ContentType {
  Single = 0,
  Series = 1,
  Episode = 2,
}

export enum VisibilityType {
  Private = 0,
  Unlisted = 1,
  Public = 2,
}

export interface GetContentListRes {
  contentList: ContentListInfo[];
}

export const sendGetContentList = async (payload: GetContentListReq): Promise<ResponseAPI<GetContentListRes>> => {
  try {
    const response = await api.post<ResponseAPI<GetContentListRes>>('/Content/getContentList', payload);
    if (response.data.resultCode === 0) return response.data;
    throw new Error(`GetContentListRes Error: ${response.data.resultCode}`);
  } catch (error) {
    console.error('Error fetching content list:', error);
    throw new Error('Failed to fetch content list. Please try again.');
  }
};

/** 콘텐츠 삭제 요청 타입 */
interface DeleteContentReq {
  contentId: number;
}

/** 콘텐츠 삭제 응답 타입 */
interface DeleteContentRes {
  resultCode: number;
  errorCode: string;
  resultMessage: string;
  data: {};
}

/**
 * 콘텐츠 삭제 API 요청
 * @param payload 삭제할 콘텐츠의 ID 정보
 * @returns API 응답 데이터
 */
export const sendDeleteContent = async (payload: DeleteContentReq): Promise<ResponseAPI<DeleteContentRes>> => {
  try {
    const response = await api.post<ResponseAPI<DeleteContentRes>>('/Content/delete', payload);

    if (response.data.resultCode === 0) return response.data;

    throw new Error(`DeleteContent Error: ${response.data.resultCode}`);
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error deleting content:', axiosError.message);
    throw new Error('Failed to delete content. Please try again.');
  }
};

export interface DeleteEpisodeReq {
  contentEpisodeId: number;
}

export interface DeleteEpisodeRes {}

export const sendDeleteEpisode = async (payload: DeleteEpisodeReq): Promise<ResponseAPI<DeleteEpisodeRes>> => {
  try {
    const response = await api.post<ResponseAPI<DeleteEpisodeRes>>('/Content/deleteEpisode', payload);
    if (response.data.resultCode === 0) return response.data;
    throw new Error(`DeleteEpisodeRes Error: ${response.data.resultCode}`);
  } catch (error) {
    console.error('Error deleting episode:', error);
    throw new Error('Failed to delete episode. Please try again.');
  }
};

export interface BuyContentEpisodeReq {
  contentId: number;
  episodeId: number;
}

export interface BuyContentEpisodeRes {
  contentId: number;
  episodeId: number;
  currentMyStar: number;
}

export const buyContentEpisode = async (payload: BuyContentEpisodeReq): Promise<ResponseAPI<BuyContentEpisodeRes>> => {
  try {
    const response = await api.post<ResponseAPI<BuyContentEpisodeRes>>('/Content/buyEpisode', payload);
    return response.data;
  } catch (error) {
    console.error('Error buyContentEpisode:', error);
    throw new Error('Failed to buyContentEpisode. Please try again.');
  }
};
export interface PlayButtonReq {
  contentId: number;
}
export interface PlayReq {
  contentId: number;
  episodeId: number;
}
export interface PlayButtonRes {
  recentlyPlayInfo: ContentPlayInfo;
  contentType: ContentType;
}

export interface ContentPlayInfo {
  contentId: number;
  episodeId: number;
  categoryType: ContentCategoryType;
  playTimeSecond: number;
  profileIconUrl: string;
  profileUrlLinkKey: string;
  profileId: number;
  isProfileFollow: boolean;
  commonMediaViewInfo: CommonMediaViewInfo;
  episodeVideoInfo?: EpisodeVideoInfo;
  episodeWebtoonInfo?: EpisodeWebtoonInfo;
  isMyEpisode: boolean;
  episodeNo: number;
  title: string;
}

export interface CommonMediaViewInfo {
  likeCount: number;
  isLike: boolean;
  dislikeCount: number;
  isDisLike: boolean;
  commentCount: number;
  isBookmark: boolean;
  isReport: boolean;
}

export interface EpisodeVideoInfo {
  likeCount: number;
  mpdTempUrl: string;
  videoSourceFileInfo: VideoFileInfo;
  subTitleFileInfos: VideoFileInfo[];
  dubbingFileInfos: VideoFileInfo[];
}

export interface EpisodeWebtoonInfo {
  likeCount: number;
  webtoonSourceUrlList: WebtoonSourceInfo[];
}

export interface WebtoonSourceInfo {
  webtoonLanguageType: number;
  webtoonSourceUrls: string[];
  webtoonSourceNames: string[];
}

export const sendPlayButton = async (payload: PlayButtonReq): Promise<ResponseAPI<PlayButtonRes>> => {
  try {
    const response = await api.post<ResponseAPI<PlayButtonRes>>('/Content/playButton', payload);
    if (response.data.resultCode === 0) return response.data;
    throw new Error(`PlayButtonRes Error: ${response.data.resultCode}`);
  } catch (error) {
    console.error('Error calling playButton API:', error);
    throw new Error('Failed to execute playButton. Please try again.');
  }
};
export const sendPlay = async (payload: PlayButtonReq): Promise<ResponseAPI<PlayButtonRes>> => {
  try {
    const response = await api.post<ResponseAPI<PlayButtonRes>>('/Content/play', payload);
    if (response.data.resultCode === 0) return response.data;
    throw new Error(`PlayRes Error: ${response.data.resultCode}`);
  } catch (error) {
    console.error('Error calling play API:', error);
    throw new Error('Failed to execute play. Please try again.');
  }
};
export interface RecordPlayReq {
  episodeRecordPlayInfo: {
    contentId: number;
    episodeId: ContentCategoryType;
    categoryType: number;
    playTimeSecond: number;
  };
}

export interface RecordPlayRes {}
export const sendRecordPlay = async (payload: RecordPlayReq): Promise<ResponseAPI<RecordPlayRes>> => {
  try {
    const response = await api.post<ResponseAPI<RecordPlayRes>>('/Content/recordPlay', payload);
    if (response.data.resultCode === 0) return response.data;
    throw new Error(`RecordPlayRes Error: ${response.data.resultCode}`);
  } catch (error) {
    console.error('Error calling recordPlay API:', error);
    throw new Error('Failed to record play. Please try again.');
  }
};
export interface GetSeasonEpisodesPopupReq {
  episodeId: number;
}

export interface GetSeasonEpisodesPopupRes {
  contentId: number;
  seasonNo: number;
  thumbnailUrl: string;
  contentName: string;
  genre: string;
  tags: string[];
  isComplete: boolean;
  episodeList: SeasonEpisodeInfo[];
}
export const sendGetSeasonEpisodesPopup = async (
  payload: GetSeasonEpisodesPopupReq,
): Promise<ResponseAPI<GetSeasonEpisodesPopupRes>> => {
  try {
    const response = await api.post<ResponseAPI<GetSeasonEpisodesPopupRes>>('/Content/getSeasonEpisodesPopup', payload);
    if (response.data.resultCode === 0) return response.data;
    throw new Error(`GetSeasonEpisodesPopupRes Error: ${response.data.resultCode}`);
  } catch (error) {
    console.error('Error fetching season episodes popup:', error);
    throw new Error('Failed to fetch season episodes popup. Please try again.');
  }
};

export enum CheckContentType {
  Content,
  Episode,
}
// ✅ 요청 타입
export interface CheckContentStateReq {
  checkContentType: CheckContentType;
  checkIdList: number[];
}

// ✅ 응답 내부 항목
export interface CheckContentItem {
  id: number;
  state: number;
}

// ✅ 응답 타입
export interface CheckContentStateRes {
  checkContentType: number;
  checkContentItemList: CheckContentItem[];
}

export const sendCheckContentState = async (
  payload: CheckContentStateReq,
): Promise<ResponseAPI<CheckContentStateRes>> => {
  try {
    const response = await api.post<ResponseAPI<CheckContentStateRes>>('/Content/checkContentState', payload);
    if (response.data.resultCode === 0) return response.data;
    throw new Error(`CheckContentState Error: ${response.data.resultCode}`);
  } catch (error) {
    console.error('Error checking content state:', error);
    throw new Error('Failed to check content state. Please try again.');
  }
};
