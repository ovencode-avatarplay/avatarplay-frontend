// src/app/Network/ContentNetwork.ts

import api, {ResponseAPI} from './ApiInstance';

// 📌 Content 생성 요청
export interface CreateContentReq {
  contentInfo: ContentInfo;
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
  contentWebtoonInfo?: ContentWebtoonInfo;
  contentVideoInfo?: ContentVideoInfo;
}

// 📌 웹툰 정보
export interface ContentWebtoonInfo {
  webtoonSourceUrls: string[];
  webtoonSourceNames: string[];
  languagePackUrls: string[];
  languagePackNames: string[];
  likeCount: number;
}

// 📌 비디오 정보
export interface ContentVideoInfo {
  videoSourceFileUrl: string;
  videoSourceFileName: string;
  subtitleFileUrls: string[];
  subtitleFileNames: string[];
  dubbingFileUrls: string[];
  dubbingFileNames: string[];
  playTime: string;
  likeCount: number;
}

export interface CreateContentRes {
  contentId: number;
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
  contentId: number;
}

export interface GetContentRes {
  contentInfo: ContentInfo;
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
  episodeInfo: ContentEpisodeInfo;
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
  categoryType: number;
  nsfw: boolean;
  monetization: boolean;
  salesStarEa: number;
  likeCount: number;
  episodeVideoInfo?: EpisodeVideoInfo;
  episodeWebtoonInfo?: EpisodeWebtoonInfo;
}

// 📌 에피소드 비디오 정보
export interface EpisodeVideoInfo {
  videoSourceFileUrl: string;
  videoSourceFileName: string;
  playTime: string;
  likeCount: number;
  subtitleFileUrls: string[];
  subtitleFileNames: string[];
  dubbingFileUrls: string[];
  dubbingFileNames: string[];
}

// 📌 에피소드 웹툰 정보
export interface EpisodeWebtoonInfo {
  likeCount: number;
  webtoonSourceUrls: string[];
  webtoonSourceNames: string[];
  languagePackUrls: string[];
  languagePackNames: string[];
}

export interface CreateEpisodeRes {
  episodeId: number;
}

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

// 📌 시즌 번호 업데이트
export interface UpdateSeasonNoReq {
  contentId: number;
  seasonNo: number;
}

export interface UpdateSeasonNoRes {
  contentId: number;
  updatedSeasonNo: number;
}

export const sendUpdateSeasonNo = async (payload: UpdateSeasonNoReq): Promise<ResponseAPI<UpdateSeasonNoRes>> => {
  try {
    const response = await api.post<ResponseAPI<UpdateSeasonNoRes>>('/Content/updateSeasonNo', payload);
    if (response.data.resultCode === 0) return response.data;
    throw new Error(`UpdateSeasonNoRes Error: ${response.data.resultCode}`);
  } catch (error) {
    console.error('Error updating season number:', error);
    throw new Error('Failed to update season number. Please try again.');
  }
};

// 📌 특정 시즌의 에피소드 리스트 가져오기
export interface GetSeasonEpisodesReq {
  contentId: number;
  seasonNo: number;
}

export interface SeasonEpisodeInfo {
  episodeId: number;
  episodeNo: number;
  episodeName: string;
  thumbnailUrl: string;
}

export interface GetSeasonEpisodesRes {
  contentThumbnailUrl: string;
  seasonNo: number;
  episodeList: SeasonEpisodeInfo[];
}

export const sendGetSeasonEpisodes = async (
  payload: GetSeasonEpisodesReq,
): Promise<ResponseAPI<GetSeasonEpisodesRes>> => {
  try {
    const response = await api.post<ResponseAPI<GetSeasonEpisodesRes>>('/Content/getSeasonEpisodes', payload);
    if (response.data.resultCode === 0) return response.data;
    throw new Error(`GetSeasonEpisodesRes Error: ${response.data.resultCode}`);
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
  name: string;
  description: string;
  genre: string;
  thumbnailUrl: string;
  episodeCount: number;
  visibility: number;
  subscriberCount: number;
  createAt: Date;
}

export enum ContentType {
  Single = 0,
  Series = 1,
}

export enum VisibilityType {
  Private = 0,
  Unlisted = 1,
  Public = 2,
  Create = 3,
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
