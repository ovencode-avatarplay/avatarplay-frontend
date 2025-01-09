// src/app/Network/ExploreNetwork.tsx

import api, {ResponseAPI} from './ApiInstance';
import {ExploreCardProps} from '../view/main/content/searchboard/SearchBoardTypes';

interface ReqExploreSearch {
  search: string;
  onlyAdults: boolean;
  language: string;
}

interface ResponseExplore {
  resultCode: number;
  resultMessage: string;
  data: {
    bannerUrlList: string[];
    searchOptionList: string[];
    talkainOperatorList: ExploreCardProps[];
    popularList: ExploreCardProps[];
    malePopularList: ExploreCardProps[];
    femalePopularList: ExploreCardProps[];
    newContentList: ExploreCardProps[];
    recommendationList: ExploreCardProps[];
    playingList: ExploreCardProps[];
  };
}

export const sendGetExplore = async (
  search: string,
  onlyAdults: boolean,
): Promise<{
  resultCode: number;
  resultMessage: string;
  bannerUrlList: string[] | null;
  searchOptionList: string[] | null;
  talkainOperatorList: ExploreCardProps[] | null;
  popularList: ExploreCardProps[] | null;
  malePopularList: ExploreCardProps[] | null;
  femalePopularList: ExploreCardProps[] | null;
  newContentList: ExploreCardProps[] | null;
  recommendationList: ExploreCardProps[] | null;
  playingList: ExploreCardProps[] | null;
}> => {
  try {
    const reqData: ReqExploreSearch = {
      search: search,
      onlyAdults: onlyAdults,
      language: navigator.language || 'en-US',
    };

    // GET 요청을 보내기 위한 기본적인 정의
    const response = await api.get<ResponseExplore>('/Explore', {params: reqData}); // GET 요청으로 수정

    const {resultCode, resultMessage, data} = response.data;

    if (resultCode === 0) {
      return {
        // 결과를 반환
        resultCode,
        resultMessage,
        bannerUrlList: data.bannerUrlList || [],
        searchOptionList: data.searchOptionList || [],
        talkainOperatorList: data.talkainOperatorList || [],
        popularList: data.popularList || [],
        malePopularList: data.malePopularList || [],
        femalePopularList: data.femalePopularList || [],
        newContentList: data.newContentList || [],
        recommendationList: data.recommendationList || [],
        playingList: data.playingList || [],
      };
    } else {
      console.error(`Error: ${resultMessage}`);
      return {
        resultCode,
        resultMessage,
        bannerUrlList: null,
        searchOptionList: null,
        talkainOperatorList: null,
        popularList: null,
        malePopularList: null,
        femalePopularList: null,
        newContentList: null,
        recommendationList: null,
        playingList: null,
      };
    }
  } catch (error: unknown) {
    console.error('Failed to fetch explore info:', error);
    return {
      resultCode: -1,
      resultMessage: 'Failed to fetch explore info',
      bannerUrlList: null,
      searchOptionList: null,
      talkainOperatorList: null,
      popularList: null,
      malePopularList: null,
      femalePopularList: null,
      newContentList: null,
      recommendationList: null,
      playingList: null,
    };
  }
};

export interface PaginationRequest {
  offset: number;
  limit: number;
}

interface filterList {
  searchFilterType: number;
  searchFilterState: number; // 0 : Positive,  1 : Negative
}

interface ReqSearchExplore {
  language: string;
  search: string;
  category: number;
  sort: number;
  filterList: filterList[];
  isOnlyAdults: boolean;
  contentPage: PaginationRequest;
  characterPage: PaginationRequest;
}

export interface ExploreItem {
  exploreItemType: number;
  updateExplorState: number;
  contentId: number;
  contentName: string;
  chatCount: number;
  followerCount: number;
  episodeCount: number;
  thumbnail: string;
  sortCount: number;
  sortCreateAt: string;
}

interface ResSearchExplore {
  searchExploreList: ExploreItem[];
  contentPage: PaginationRequest;
  characterPage: PaginationRequest;
}

export const sendSearchExplore = async (payload: ReqSearchExplore): Promise<ResponseAPI<ResSearchExplore>> => {
  try {
    // POST 요청을 통해 Explore/search API 호출
    const response = await api.post<ResponseAPI<ResSearchExplore>>('/Explore/search', payload);

    return response.data;
  } catch (error) {
    console.error('Failed to fetch explore search info:', error);

    return {
      resultCode: -1,
      resultMessage: 'Failed to fetch explore search info',
      data: {
        searchExploreList: [],
        contentPage: {offset: 0, limit: 0},
        characterPage: {offset: 0, limit: 0},
      },
    };
  }
};
