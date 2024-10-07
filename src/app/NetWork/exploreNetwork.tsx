// src/app/Network/ExploreNetwork.ts
import { AxiosInstance } from 'axios';
import api from './apiInstance';

// 검색 요청 타입
export interface ReqExploreSearch {
  search: string;
  onlyAdults: boolean;
}

// 탐색 API
export interface ExploreInfo {
  characterId: number;
  shortsId: string;
  thumbnail: string;
}

export const sendGetExplore = async (search: string, onlyAdults: boolean) => {
  try {
    const reqData: ReqExploreSearch = { search, onlyAdults };
    const response = await api.get(`/Explore`, { params: reqData });
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to fetch explore data');
  }
};
