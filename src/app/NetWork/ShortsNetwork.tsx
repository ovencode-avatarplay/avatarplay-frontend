// src/app/Network/ShortsNetwork.ts

import api, {ResponseAPI} from './ApiInstance';
import {MediaState} from './ProfileNetwork';

// 쇼츠 정보 타입
export interface ShortsInfo {
  characterId: number;
  shortsId: string;
  summary: string;
  thumbnailList: string[];
}

interface ResponseHomeFeedShorts {
  resultCode: number;
  resultMessage: string;
  data: {
    shortsInfoList: ShortsInfo[];
  };
}

export const sendGetHomeFeedShorts = async (): Promise<{
  resultCode: number;
  resultMessage: string;
  data: ShortsInfo[] | null; // 변경된 부분
}> => {
  try {
    // GET 요청을 보내기 위한 기본적인 정의
    const response = await api.get<ResponseHomeFeedShorts>('/Home/shorts'); // GET 요청으로 수정

    const {resultCode, resultMessage, data} = response.data;

    if (resultCode === 0) {
      return {resultCode, resultMessage, data: data.shortsInfoList}; // shortsInfoList를 반환
    } else {
      console.error(`Error: ${resultMessage}`);
      return {resultCode, resultMessage, data: null};
    }
  } catch (error) {
    console.error('Failed to fetch shorts info:', error);
    return {resultCode: -1, resultMessage: 'Failed to fetch shorts info', data: null};
  }
};

export interface FeedInfo {
  id: number;
  title: string;
  urlLinkKey: string;
  mediaState: MediaState;
  mediaUrlList: string[];
  description: string;
  hashTag: string;
  commentCount: number;
  likeCount: number;
  disLikeCount: number;
  isLike: boolean;
  isDisLike: boolean;
  isBookmark: boolean;
  isPinFix: boolean;
  isFollowing: boolean;
  playTime: string;
  profileId: number;
  profileName: string;
  profileIconUrl: string;
  createAt?: string;
  profileUrlLinkKey: string;
  isMyFeed: boolean;
}

export interface CreateFeedReq {
  languageType: string;
  profileId?: number;
  feedInfo: CreateFeedInfo;
}

export interface CreateFeedInfo {
  id: number;
  mediaState: number;
  mediaUrlList: string[];
  title: string;
  description: string;
  hashTag: string;
  visibilityType: number;
  nsfw: boolean;
}

export interface CreateFeedRes {}

export const sendCreateFeed = async (payload: CreateFeedReq): Promise<ResponseAPI<CreateFeedRes>> => {
  try {
    const response = await api.post<ResponseAPI<CreateFeedRes>>('/Feed/create', payload);
    if (response.data.resultCode === 0) return response.data;
    throw new Error(`CreateFeedRes Error: ${response.data.resultCode}`);
  } catch (error) {
    console.error('Error creating feed:', error);
    throw new Error('Failed to create feed. Please try again.');
  }
};

// Recommend Feed API Types
export interface RecommendFeedReq {
  recommendState: number;
  languageType: string;
}

export interface RecommendFeedRes {
  feedInfoList: FeedInfo[];
}

/**
 * 추천 피드 가져오기
 * @param payload 요청 본문에 포함할 데이터 (언어 정보)
 * @returns API 응답 결과
 */
export const sendGetRecommendFeed = async (payload: RecommendFeedReq): Promise<ResponseAPI<RecommendFeedRes>> => {
  try {
    // POST 요청으로 변경
    console.log('리코맨드시작');
    const response = await api.post<ResponseAPI<RecommendFeedRes>>('/Feed/recommend', payload);

    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      throw new Error(`RecommendFeedRes Error: ${response.data.resultCode}`);
    }
  } catch (error) {
    console.error('Error fetching recommended feeds:', error);
    throw new Error('Failed to fetch recommended feeds. Please try again.');
  }
};

export interface getFeedListReq {
  languageType: string;
  characterProfileId: number;
}

// GET Feed List API 호출 함수
export const sendGetFeedList = async (
  payLoad: getFeedListReq,
): Promise<{resultCode: number; resultMessage: string; data: FeedInfo[] | null}> => {
  try {
    const response = await api.post('/Feed/getFeedList', payLoad);
    const {resultCode, resultMessage, data} = response.data;

    if (resultCode === 0) {
      return {resultCode, resultMessage, data: data?.feedInfoList || null};
    } else {
      console.error(`Error: ${resultMessage}`);
      return {resultCode, resultMessage, data: null};
    }
  } catch (error) {
    console.error('Failed to fetch feed list:', error);
    return {
      resultCode: -1,
      resultMessage: 'Failed to fetch feed list',
      data: null,
    };
  }
};

// Feed View API 호출 함수
export const sendFeedView = async (
  feedId: number,
): Promise<{resultCode: number; resultMessage: string; data: FeedInfo | null}> => {
  try {
    const response = await api.post('/Feed/view', {feedId});
    const {resultCode, resultMessage, data} = response.data;

    if (resultCode === 0) {
      return {resultCode, resultMessage, data: data?.feedInfo || null};
    } else {
      console.error(`Error: ${resultMessage}`);
      return {resultCode, resultMessage, data: null};
    }
  } catch (error) {
    console.error('Failed to view feed:', error);
    return {
      resultCode: -1,
      resultMessage: 'Failed to view feed',
      data: null,
    };
  }
};

// Feed Share API 호출 함수
export const sendFeedShare = async (feedId: number): Promise<{resultCode: number; resultMessage: string}> => {
  try {
    const response = await api.post('/Feed/share', {feedId});
    const {resultCode, resultMessage} = response.data;

    if (resultCode === 0) {
      return {resultCode, resultMessage};
    } else {
      console.error(`Error: ${resultMessage}`);
      return {resultCode, resultMessage};
    }
  } catch (error) {
    console.error('Failed to share feed:', error);
    return {
      resultCode: -1,
      resultMessage: 'Failed to share feed',
    };
  }
};

// Feed Get API 요청 타입
export interface GetFeedReq {
  urlLinkKey: string;
  languageType: string;
}
// Feed Get API 응답 타입
export interface GetFeedRes {
  feedInfo: FeedInfo;
}
/**
 * 특정 피드 가져오기
 * @param payload 요청 본문에 포함할 데이터 (urlLinkKey, languageType)
 * @returns API 응답 결과
 */
export const sendGetFeed = async (
  payload: GetFeedReq,
): Promise<{
  resultCode: number;
  resultMessage: string;
  data: GetFeedRes | null;
}> => {
  try {
    // POST 요청 실행
    const response = await api.post('/Feed/get', payload);
    const {resultCode, resultMessage, data} = response.data;

    if (resultCode === 0) {
      return {resultCode, resultMessage, data: data || null}; // 성공 시 데이터 반환
    } else {
      console.error(`Error: ${resultMessage}`);
      return {resultCode, resultMessage, data: null}; // 실패 시 데이터 null
    }
  } catch (error) {
    console.error('Failed to fetch feed:', error);
    return {
      resultCode: -1,
      resultMessage: 'Failed to fetch feed',
      data: null,
    };
  }
};

export interface PinFixFeedReq {
  feedId: number;
  isFix: boolean;
}

export interface PinFixFeedRes {}

export const updatePin = async (payload: PinFixFeedReq): Promise<PinFixFeedRes> => {
  try {
    const response = await api.post('/Common/pin', payload);
    const {resultCode, resultMessage, data} = response.data;

    return {
      resultCode,
      resultMessage,
      data: data || {}, // 데이터가 없을 경우 빈 객체 반환
    };
  } catch (error) {
    console.error('Failed to pin feed:', error);
    return {
      resultCode: -1,
      resultMessage: 'Failed to pin feed',
      data: {},
    };
  }
};

export interface DeleteFeedeReq {
  feedId: number;
}

export interface DeleteFeedRes {}

export const deleteFeed = async (payload: DeleteFeedeReq) => {
  try {
    const res = await api.post<ResponseAPI<DeleteFeedRes>>('feed/delete', payload);

    if (res.status !== 200) {
      console.error('deleteFeed API 응답 오류:', res);
      return null;
    }

    return res.data;
  } catch (e) {
    console.error('deleteFeed API 요청 실패:', e);
    alert('API 요청 중 에러 발생: ' + e);
    return null;
  }
};
