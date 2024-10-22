// src/app/Network/ContentNetwork.tsx

import {PublishInfo} from '@/types/apps/content/chapter/publishInfo';
import api, {ResponseAPI} from './ApiInstance';
import {ContentInfo} from '@/types/apps/content/contentInfo';
import {ChapterInfo} from '@/types/apps/content/chapter/chapterInfo';
import {ContentDashboardItem} from '@/redux-store/slices/myContentDashboard';

// Save Content
export interface SaveContentReq {
  contentInfo: ContentInfo;
}

export interface SaveContentRes {
  contentId: number;
}

export const sendContentSave = async (payload: SaveContentReq): Promise<ResponseAPI<SaveContentRes>> => {
  try {
    const response = await api.post<ResponseAPI<SaveContentRes>>('Content/save', payload);

    if (response.data.resultCode === 0) {
      console.log('제출 결과 성공');

      return response.data;
    } else {
      throw new Error('SaveContentRes' + response.data.resultCode); // 실패 메시지 처리
    }
  } catch (error: any) {
    console.error('Error sending save content data:', error);
    throw new Error('Failed to send save content data. Please try again.'); // 에러 처리
  }
};

// Get Content

// Get Content By ContnetId for ExploreItem
export interface GetContentByIdReq {
  contentId: number;
}

export interface GetContentByIdRes {
  chatCount: number;
  chatUserCount: number;
  publishInfo: PublishInfo;
  chapterInfoList: ChapterInfo[];
  recommandContentInfoList: recommendContentInfo[];
}

export interface recommendContentInfo {
  contentId: number;
  imageUrl: string;
}

export const sendContentByIdGet = async (payload: GetContentByIdReq): Promise<ResponseAPI<GetContentByIdRes>> => {
  try {
    const response = await api.post<ResponseAPI<GetContentByIdRes>>('Content/get', payload);

    if (response.data.resultCode === 0) {
      console.log('제출 결과 성공');
      return response.data;
    } else {
      throw new Error(`GetContentByIdRes Error: ${response.data.resultCode}`);
    }
  } catch (error: any) {
    console.error('Error sending get content data:', error);
    throw new Error('Failed to send get content data. Please try again.');
  }
};

// Get TotalContent By ContentId
export interface GetTotalContentByIdReq {
  contentId: number;
}

export interface GetTotalContentByIdRes {
  contentInfo: ContentInfo;
}

export const sendContentByIdGetTotal = async (
  payload: GetTotalContentByIdReq,
): Promise<ResponseAPI<GetTotalContentByIdRes>> => {
  try {
    const response = await api.post<ResponseAPI<GetTotalContentByIdRes>>('Content/getTotal', payload);

    if (response.data.resultCode === 0) {
      console.log('제출 결과 성공');
      return response.data;
    } else {
      throw new Error(`GetTotalContentByIdRes Error: ${response.data.resultCode}`);
    }
  } catch (error: any) {
    console.error('Error sending get total content data:', error);
    throw new Error('Failed to send get total content data. Please try again.');
  }
};

// Get Contents By UserId
export interface GetContentsByUserIdReq {
  userId: number;
}

export interface GetContentsByUserIdRes<> {
  contentDashBoardList: ContentDashboardItem[];
}

export const sendContentByUserIdGet = async (
  payload: GetContentsByUserIdReq,
): Promise<ResponseAPI<GetContentsByUserIdRes>> => {
  try {
    const response = await api.post<ResponseAPI<GetContentsByUserIdRes>>('Content/dashboard', payload);

    if (response.data.resultCode === 0) {
      console.log('제출 결과 성공');
      return response.data;
    } else {
      throw new Error(`GetContentByUserIdRes Error: ${response.data.resultCode}`);
    }
  } catch (error: any) {
    console.error('Error sending get content data:', error);
    throw new Error('Failed to send get content data. Please try again.');
  }
};
