// src/app/Network/ContentNetwork.ts
import { AxiosInstance } from 'axios';
import api from './apiInstance';
import { ContentInfo } from '@/types/apps/content/contentInfo';

// 콘텐츠 저장
export interface SaveContentReq {
  contentInfo: ContentInfo;
}

export const sendContentSave = async (payload: SaveContentReq) => {
  try {
    const response = await api.post(`/Content/save`, payload);
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to save content');
  }
};

// 콘텐츠 가져오기
export interface GetContentReq {
  contentId: number;
}

export const sendContentGet = async (payload: GetContentReq) => {
  try {
    const response = await api.post(`/Content/get`, payload);
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to fetch content data');
  }
};
