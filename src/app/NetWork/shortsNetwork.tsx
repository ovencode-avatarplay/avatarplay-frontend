// src/app/Network/ShortsNetwork.ts
import { AxiosInstance } from 'axios';
import api from './apiInstance';

// 쇼츠 정보 타입
export interface ShortsInfo {
  characterId: number;
  shortsId: string;
  summary: string;
  thumbnailList: string[];
}

// 쇼츠 리스트 조회
export const sendGetHomeFeedShorts = async () => {
  try {
    const response = await api.get(`/Home/shorts`);
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to fetch shorts info');
  }
};
