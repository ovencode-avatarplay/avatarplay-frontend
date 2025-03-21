// src/app/Network/ExploreNetwork.tsx

import api, {ResponseAPI} from './ApiInstance';
import {getCurrentLanguage} from '@/utils/UrlMove';
import {MediaState} from './ProfileNetwork';
import {ContentType} from './ContentNetwork';

export interface BannerUrlList {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  imageLinkUrl: string;
}

interface ReqExploreSearch {
  search: string;
  onlyAdults: boolean;
  language: string;
}

interface ResponseExplore {
  resultCode: number;
  resultMessage: string;
  data: {
    bannerUrlList: BannerUrlList[];
    characterExploreList: ExploreItem[];
    storyExploreList: ExploreItem[];
    contentExploreList: ExploreItem[];
  };
}

export const sendGetExplore = async (
  search: string,
  onlyAdults: boolean,
): Promise<{
  resultCode: number;
  resultMessage: string;
  bannerUrlList: BannerUrlList[];
  characterExploreList: ExploreItem[];
  storyExploreList: ExploreItem[];
  contentExploreList: ExploreItem[];
}> => {
  try {
    const reqData: ReqExploreSearch = {
      search: search,
      onlyAdults: onlyAdults,
      language: getCurrentLanguage(),
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
        characterExploreList: data.characterExploreList || [],
        storyExploreList: data.storyExploreList || [],
        contentExploreList: data.contentExploreList || [],
      };
    } else {
      console.error(`Error: ${resultMessage}`);
      return {
        resultCode,
        resultMessage,
        bannerUrlList: [],
        characterExploreList: [],
        storyExploreList: [],
        contentExploreList: [],
      };
    }
  } catch (error: unknown) {
    console.error('Failed to fetch explore info:', error);
    return {
      resultCode: -1,
      resultMessage: 'Failed to fetch explore info',
      bannerUrlList: [],
      characterExploreList: [],
      storyExploreList: [],
      contentExploreList: [],
    };
  }
};

interface filterList {
  searchFilterType: number;
  searchFilterState: number; // 0 : Positive,  1 : Negative
}

export enum ExploreItemType {
  Story = 0,
  Character = 1,
  Content = 2,
}

export interface ExploreItem {
  exploreItemType: ExploreItemType;
  profileId: number;
  profileUrlLinkKey: string;
  typeValueId: number;
  name: number;
  thumbnailMediaState: MediaState;
  thumbnail: string;
  chatUserCount: number;
  chatCount: number;
  likeCount: number;
  episodeCount: number;
  contentType: ContentType;
  contentUrlLinkKey: string;
  createAt: string;
}

interface SearchRes {
  storyOffset: number;
  characterOffset: number;
  contentOffset: number;
  searchExploreList: ExploreItem[];
}

interface SearchReq {
  languageType: string;
  search: string;
  category: number;
  sort: number;
  // filterList: filterList[];
  // isOnlyAdults: boolean;
  storyOffset: number;
  characterOffset: number;
  contentOffset: number;
  limit: number;
}

export const sendSearchExplore = async (payload: SearchReq): Promise<ResponseAPI<SearchRes>> => {
  try {
    // POST 요청을 통해 Explore/search API 호출
    const response = await api.post<ResponseAPI<SearchRes>>('/Explore/search', payload);

    if (response && response.data.resultCode === 0) return response.data;
    else {
      return {
        resultCode: response.data.resultCode,
        resultMessage: response.data.resultMessage,
        data: {
          searchExploreList: [],
          storyOffset: 0,
          characterOffset: 0,
          contentOffset: 0,
        },
      };
    }
  } catch (error) {
    console.error('Failed to fetch explore search info:', error);

    return {
      resultCode: -1,
      resultMessage: 'Failed to fetch explore search info',
      data: {
        searchExploreList: [],
        storyOffset: 0,
        characterOffset: 0,
        contentOffset: 0,
      },
    };
  }
};
