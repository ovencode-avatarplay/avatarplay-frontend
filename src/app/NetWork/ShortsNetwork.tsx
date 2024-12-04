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
