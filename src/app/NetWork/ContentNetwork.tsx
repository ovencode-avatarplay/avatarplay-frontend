// src/app/Network/ContentNetwork.tsx

import { PublishInfo } from '@/types/apps/content/chapter/publishInfo';
import api, { ResponseAPI } from './ApiInstance'; 
import { ContentInfo } from '@/types/apps/content/contentInfo';
import { ChapterInfo } from '@/types/apps/content/chapter/chapterInfo';


export interface SaveContentReq {
    contentInfo: ContentInfo;
  }
  
  export interface SaveContentRes {
    resultCode: number;
    resultMessage: string;
    data: {
      contentId: number;
      // contentInfo: ContentInfo;
    };
  }
  
  export const sendContentSave = async (payload: SaveContentReq): Promise<ResponseAPI<SaveContentRes>> => {
    try {
      const response = await api.post<ResponseAPI<SaveContentRes>>('Content/save', payload);
      
      if (response.data.resultCode === 0) {
        console.log('제출 결과 성공');
  
        return response.data; 
      } else {
        throw new Error("SaveContentRes" + response.data.resultCode); // 실패 메시지 처리
      }
    } catch (error: any) {
      console.error('Error sending save content data:', error);
      throw new Error('Failed to send save content data. Please try again.'); // 에러 처리
    }
  };
  
  export interface GetContentReq {
    contentId : number;
  }
  
  export interface GetContentRes {
    resultCode: number;
    resultMessage: string;
    data: {
      chatCount : number;
      chatUserCount : number
      publishInfo: PublishInfo;
      chapterInfoList: ChapterInfo[];
    };
  }
  
  export const sendContentGet = async (payload: GetContentReq): Promise<GetContentRes> => {
    try {
      const response = await api.post<GetContentRes>('Content/get', payload);
  
      if (response.data.resultCode === 0) {
        console.log('제출 결과 성공');
        return response.data;  
      } else {
        throw new Error(`GetContentRes Error: ${response.data.resultCode}`);
      }
    } catch (error: any) {
      console.error('Error sending get content data:', error);
      throw new Error('Failed to send get content data. Please try again.');
    }
  };