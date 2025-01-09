// src/app/Network/ShortsNetwork.ts

import api from './ApiInstance';

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
  mediaState: number;
  mediaUrlList: string[];
  description: string;
  hashTag: string;
  likeCount: number;
  disLikeCount: number;
  playTime: string;
}

interface RequestCreateFeed {
  feedInfo: FeedInfo;
}

interface ResponseCreateFeed {
  resultCode: number;
  resultMessage: string;
  data: any; // API 응답 데이터 구조에 따라 수정 가능
}

/**
 * Feed 생성 API 호출 함수
 * @param feedInfo - 생성할 Feed 정보
 * @returns API 응답 결과
 */
export const sendCreateFeed = async (
  feedInfo: FeedInfo,
): Promise<{resultCode: number; resultMessage: string; data: any | null}> => {
  try {
    // POST 요청 전송
    const response = await api.post<ResponseCreateFeed>('/Feed/create', {
      feedInfo,
    });

    const {resultCode, resultMessage, data} = response.data;

    if (resultCode === 0) {
      return {resultCode, resultMessage, data};
    } else {
      console.error(`Error: ${resultMessage}`);
      return {resultCode, resultMessage, data: null};
    }
  } catch (error) {
    console.error('Failed to create feed:', error);
    return {
      resultCode: -1,
      resultMessage: 'Failed to create feed',
      data: null,
    };
  }
};

// Feed 정보 타입 정의
export interface FeedInfo {
  id: number;
  mediaState: number;
  mediaUrlList: string[];
  description: string;
  hashTag: string;
  likeCount: number;
  disLikeCount: number;
  playTime: string;
}

// getFeedList API 응답 타입 정의
interface ResponseGetFeedList {
  resultCode: number;
  resultMessage: string;
  data: {
    feedInfoList: FeedInfo[];
  } | null;
}

/**
 * Feed 리스트 가져오기
 * @param characterProfileId - 요청에 사용될 캐릭터 프로필 ID
 * @returns API 응답 결과
 */
export const sendGetFeedList = async (
  characterProfileId: number,
): Promise<{resultCode: number; resultMessage: string; data: FeedInfo[] | null}> => {
  try {
    // POST 요청 전송
    const response = await api.post<ResponseGetFeedList>('/Feed/getFeedList', {
      characterProfileId,
    });

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

// Feed 정보 타입 정의
export interface FeedInfo {
  id: number;
  mediaState: number;
  mediaUrlList: string[];
  description: string;
  hashTag: string;
  likeCount: number;
  disLikeCount: number;
  playTime: string;
}

// 추천 피드 API 응답 타입 정의
interface ResponseRecommendFeed {
  resultCode: number;
  resultMessage: string;
  data: {
    feedInfoList: FeedInfo[];
  } | null;
}

/**
 * 추천 피드 가져오기
 * @returns API 응답 결과
 */
export const sendGetRecommendFeed = async (): Promise<{
  resultCode: number;
  resultMessage: string;
  data: FeedInfo[] | null;
}> => {
  try {
    // GET 요청 전송
    const response = await api.get<ResponseRecommendFeed>('/Feed/recommend');

    const {resultCode, resultMessage, data} = response.data;

    if (resultCode === 0) {
      return {resultCode, resultMessage, data: data?.feedInfoList || null};
    } else {
      console.error(`Error: ${resultMessage}`);
      return {resultCode, resultMessage, data: null};
    }
  } catch (error) {
    console.error('Failed to fetch recommended feeds:', error);
    return {
      resultCode: -1,
      resultMessage: 'Failed to fetch recommended feeds',
      data: null,
    };
  }
};
