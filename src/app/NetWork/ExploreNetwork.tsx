// src/app/Network/ExploreNetwork.tsx

import api, { ResponseAPI } from './ApiInstance'; 


interface ReqExploreSearch {
    search : string,
    onlyAdults : boolean
  }
  
  export interface ExploreInfo {
    episodeId: number;
    shortsId: string;
    thumbnail: string;
  }
  
  interface ResponseExplore {
    resultCode: number;
    resultMessage: string;
    data: {
      playingList: ExploreInfo[];
      recommendationList: ExploreInfo[];
      searchOptionList: string[];
    };
  }
  
  export const sendGetExplore = async (search : string, onlyAdults : boolean): Promise<{
    resultCode: number;
    resultMessage: string;
    searchOptionList: string[] | null;
    playingListData: ExploreInfo[] | null; 
    recommendationListData: ExploreInfo[] | null; 
  }> => {
    try {
  
      const reqData: ReqExploreSearch = { search: search, onlyAdults: onlyAdults }
  
      // GET 요청을 보내기 위한 기본적인 정의
      const response = await api.get<ResponseExplore>('/Explore', { params: reqData }); // GET 요청으로 수정
  
      const { resultCode, resultMessage, data } = response.data;
  
      if (resultCode === 0) {
        return { // 결과를 반환
          resultCode,
          resultMessage,
          searchOptionList: data.searchOptionList || [],
          playingListData: data.playingList || []
          , recommendationListData: data.recommendationList || []
        }; 
      } else {
        console.error(`Error: ${resultMessage}`);
        return { resultCode, resultMessage, searchOptionList: null, playingListData: null, recommendationListData: null };
      }
    } catch (error: unknown) {
      console.error('Failed to fetch shorts info:', error);
      return { resultCode: -1, resultMessage: 'Failed to fetch shorts info', searchOptionList: null, playingListData: null, recommendationListData: null };
    }
  };