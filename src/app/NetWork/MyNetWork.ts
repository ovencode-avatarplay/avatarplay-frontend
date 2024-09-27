// src/MyNetwork.ts
import React, { useEffect, useState } from 'react';

import type { AxiosInstance } from 'axios';
import axios from 'axios';
import { number } from 'valibot';


// interface
import {PayloadChat} from './network-interface/payloadChat'


// Axios 인스턴스 생성
const api: AxiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_CHAT_API_URL}/api/v1/`, // 새로운 베이스 URL
  headers: {
    'Content-Type': 'application/json', // JSON 데이터 전송을 명시
  },
  httpsAgent: new (require('https').Agent)({
    rejectUnauthorized: false,
  }),
})

//==== 채팅 =======================================================================================================

// 채팅 보내기 - Req

// 채팅 보내기 - Rec
export interface ResponseChat {
  resultCode: number;        // 응답 코드
  resultMessage: string;     // 응답 메시지
  data: {
    text: string;            // 서버에서 반환하는 데이터
  };
}

interface ResponseAPI<T> {
  resultCode: number;        // 응답 코드
  resultMessage: string;     // 응답 메시지
  data: T;
}


export interface SendChatMessageReq {
  userID: number;
  characterID: number;
  text: string;
}

export interface SendChatMessageRes {
  streamKey: string;
}

export const sendMessageStream = async (sendChatMessageReq: SendChatMessageReq): Promise<ResponseAPI<SendChatMessageRes>> => {
  let sendChatMessageRes: ResponseAPI<SendChatMessageRes>;

  try {
    console.log("CHAT_API_URL : ", process.env.NEXT_PUBLIC_CHAT_API_URL)
    const response = await api.post<ResponseAPI<SendChatMessageRes>>(`${process.env.NEXT_PUBLIC_CHAT_API_URL}/api/v1/Chat/send`, sendChatMessageReq);

    const data = response.data;

    if (data.resultCode === 0) {
      sendChatMessageRes = data;
    } else {
      throw new Error(data.resultMessage); // 실패 메시지 처리
    }
  } catch (error: any) {
    console.error('Error sendMessageStream :', error);
    throw new Error('Failed to send message. Please try again.'); // 에러 처리
  }

  return sendChatMessageRes;
};

export interface MessageInfo {
  id: number;
  userName: string;
  characterName: string;
  message: string;
  createAt: Date;
}

export interface GetPrevChatMessageRes {
  messageInfoList: MessageInfo[];
}

export interface GetPrevChatMessageReq {
  userID: number;
  characterID: number;
}

export const getPrevChat = async (data: GetPrevChatMessageReq) => {
  try {
    const response = await api.post<ResponseAPI<GetPrevChatMessageRes>>(`${process.env.NEXT_PUBLIC_CHAT_API_URL}/api/v1/Chat/getPrevChat`, data);

    if (response.data.resultCode === 0) {
      return response.data; // 성공적으로 응답을 받은 경우
    } else {
      throw new Error(response.data.resultMessage); // 실패 메시지 처리
    }
  } catch (error: any) {
    console.error('Error sending message:', error);
    throw new Error('Failed to send message. Please try again.'); // 에러 처리
  }
}


// POST 요청 함수 정의
export const sendElasticMessage = async (payload: PayloadChat): Promise<ResponseChat> => {
  try {
    const response = await api.post<ResponseChat>('/Bedrock/sendElastic', payload);
    const data = response.data;

    if (data.resultCode === 0) {

      return data; // 성공적으로 응답을 받은 경우
    } else {
      throw new Error(data.resultMessage); // 실패 메시지 처리
    }
  } catch (error: any) {
    console.error('Error sending message:', error);
    throw new Error('Failed to send message. Please try again.'); // 에러 처리
  }
};

//==== Set 캐릭터 정보 =======================================================================================================

// 캐릭터 설정 - Req
export interface PayloadCharacterData {
  userId: number;
  characterName: string;
  characterDescription: string;
  worldScenario: string;
  introduction: string;
  secret: string;
  thumbnail: string;
}

// 캐릭터 설정 - Rec
export interface SetCharacterRes {
  characterID: number;
}
// 캐릭터 데이터를 전송하는 새로운 POST 요청 함수 정의
export const sendCharacterData = async (payload: PayloadCharacterData): Promise<ResponseAPI<SetCharacterRes>> => {
  try {
    const response = await api.post<ResponseAPI<SetCharacterRes>>('DemoChat/setCharacter', payload); // '/character' 엔드포인트로 POST 요청 전송
    
    if (response.data.resultCode === 0) {
      //console.log('제출 결과 성공');

      return response.data; // 성공적으로 응답을 받은 경우
    } else {
      throw new Error("CharacterDataResponse" + response.data.resultCode); // 실패 메시지 처리
    }
  } catch (error: any) {
    console.error('Error sending character data:', error);
    throw new Error('Failed to send character data. Please try again.'); // 에러 처리
  }
};

//==== Modify 캐릭터 정보 =======================================================================================================

export interface UpdateCharacterReq {
  userID: number;
  characterID: number;
  characterName: string;
  characterDescription: string;
  worldScenario: string;
  introduction: string;
  secret: string;
  thumbnail: string;
}

// 캐릭터 설정 - Req
export interface UpdateCharacterRes {
  characterID: number;
  characterName: string;
  characterDescription: string;
  worldScenario: string;
  introduction: string;
  secret: string;
  thumbnail: string;
}

// 캐릭터 데이터를 전송하는 새로운 POST 요청 함수 정의
export const updateCharacterData = async (payload: UpdateCharacterReq): Promise<ResponseAPI<UpdateCharacterRes>> => {
  try {
    console.error('update sending character data:', payload);
    const response = await api.post<ResponseAPI<UpdateCharacterRes>>('DemoChat/updateCharacter', payload); // '/character' 엔드포인트로 POST 요청 전송
    
    if (response.data.resultCode === 0) {
      //console.log('제출 결과 성공');

      return response.data; // 성공적으로 응답을 받은 경우
    } else {
      throw new Error("UpdateCharacterRes" + response.data.resultCode); // 실패 메시지 처리
    }
  } catch (error: any) {
    console.error('Error sending character data:', error);
    throw new Error('Failed to send character data. Please try again.'); // 에러 처리
  }
};

//==== Delete 캐릭터 정보 =======================================================================================================

export interface DeleteCharacterReq {
  characterID: number;
}

export interface DeleteCharacterRes {
    characterInfoList: CharacterInfo[];
}

// 캐릭터 데이터를 전송하는 새로운 POST 요청 함수 정의
export const deleteCharacterData = async (payload: DeleteCharacterReq): Promise<ResponseAPI<UpdateCharacterRes>> => {
  try {
    //console.log('캐릭터 삭제 요청2');
    const response = await api.post<ResponseAPI<UpdateCharacterRes>>('DemoChat/deleteCharacter', payload); // '/character' 엔드포인트로 POST 요청 전송
    
    if (response.data.resultCode === 0) {
      //console.log('제출 결과 성공');

      return response.data; // 성공적으로 응답을 받은 경우
    } else {
      throw new Error("deleteCharacterRes" + response.data.resultCode); // 실패 메시지 처리
    }
  } catch (error: any) {
    console.error('Error sending character data:', error);
    throw new Error('Failed to send character data. Please try again.'); // 에러 처리
  }
};

//==== Get 캐릭터 리스트 정보 =======================================================================================================

// Type Definitions
interface CharacterInfo {
  id: number;
  name: string;
}

interface ResponseCharactersInfo {
    characterInfoList: CharacterInfo[];
  };


// Fetch Character Info Function
export const fetchCharacterInfo = async (): Promise<{
  resultCode: number;
  resultMessage: string;
  data: {
    characterInfoList: CharacterInfo[];
  } | null;
}> => {
  try {
    //console.log('요청합니다 시작');

    // POST 요청을 보내기 위한 기본적인 payload 정의
    const payload = {}; // 필요한 경우 이곳에 payload를 정의

    const response = await api.post<ResponseAPI<ResponseCharactersInfo>>('DemoChat/getCharacters', payload); // POST 요청

    const { resultCode, resultMessage, data } = response.data;

    if (resultCode === 0) {
      //console.log('성공적으로 데이터 가져옴:', data.characterInfoList);

      return { resultCode, resultMessage, data };
    } else {
      console.error(`Error: ${resultMessage}`);

      return { resultCode, resultMessage, data: null };
    }
  } catch (error: any) {
    console.error('Failed to fetch character info:', error);

    return { resultCode: -1, resultMessage: 'Failed to fetch character info', data: null };
  }
};

//==== Get 캐릭터 상세 정보 =======================================================================================================

interface ReqCharacterInfoDetail {
  characterID: number;
}

interface CharacterDataDetail{
    secrets: string,
    char_name: string,
    first_mes: string,
    char_persona: string,
    world_scenario: string,
}; 

interface ResponseCharacterInfoDetail
{
  resultCode: number,
  resultMessage: string,
  data: {
    characterID: number,
    characterData: CharacterDataDetail
    }
  thumbnail: string
}

export const sendCharacterInfoDetail = async (charaterID: number): Promise<{
  resultCode: number;
  resultMessage: string;
  data: {
    characterID: number;
    characterData: CharacterDataDetail;
  } | null;
  thumbnail: string;
}> => {
  try {
    //console.log('요청합니다 시작');
    const ReqData: ReqCharacterInfoDetail = {characterID: charaterID};
    
    // POST 요청을 보내기 위한 기본적인 payload 정의
    //const payload = {}; // 필요한 경우 이곳에 payload를 정의

    //console.log('reqdata ',ReqData)
    const response = await api.post<ResponseCharacterInfoDetail>('DemoChat/getCharacter', ReqData ); // POST 요청

    const { resultCode, resultMessage, data, thumbnail } = response.data;

    if (resultCode === 0) {
      //console.log('성공적으로 캐릭터 상세 데이터 가져옴:', data );

      return { resultCode, resultMessage, data, thumbnail };
    } else {
      console.error(`Error: ${resultMessage}`);

      return { resultCode, resultMessage, data: null, thumbnail };
    }
  } catch (error: any) {
    console.error('Failed to fetch character info:', error);

    return { resultCode: -1, resultMessage: 'Failed to fetch character info', data: null, thumbnail: "" };
  }

  
};

//==== Get 채팅 프롬프트 =======================================================================================================

interface ReqChatPrompt {
  chatID: number;
}

interface ResponseChatInfoDetail {
  resultCode: number;
  resultMessage: string;
  data: {
    Question: string;
    Answer: string;
    prompt: string;
  };  
}

export const sendChatInfoDetail = async (chatID: number): Promise<{
  resultCode: number;
  resultMessage: string;
  data: {
    prompt: string;
  } | null;
}> => {
  try {
    // 요청 데이터를 올바르게 구성
    const ReqData: ReqChatPrompt = { chatID };

    // POST 요청을 보내기 위한 기본적인 payload 정의
    const response = await api.post<ResponseChatInfoDetail>('DemoChat/getChatPrompt', ReqData); // POST 요청

    const { resultCode, resultMessage, data} = response.data;

    if (resultCode === 0) {
      return { resultCode, resultMessage, data };
    } else {
      console.error(`Error: ${resultMessage}`);
      return { resultCode, resultMessage, data: null };
    }
  } catch (error: any) {
    console.error('Failed to fetch character info:', error);
    return { resultCode: -1, resultMessage: 'Failed to fetch character info', data: null };
  }
};

//==== Get 채팅 프롬프트 템플릿 =======================================================================================================
interface ReqPromptTemplate {

}

interface ResponsePromptTemplate {
  resultCode: number;
  resultMessage: string;
  data: {
    prevConversationTemplate: string;
    ragTemplate: string;
    expressionTemplate: string;
  };
}

export const sendGetPromptTemplate = async (): Promise<{
  resultCode: number;
  resultMessage: string;
  data: {
    prevConversationTemplate: string;
    ragTemplate: string;
    expressionTemplate: string;
  } | null;
}> => {
  try {
    // 요청 데이터를 올바르게 구성
    const ReqData: ReqPromptTemplate = {  };

    // POST 요청을 보내기 위한 기본적인 payload 정의
    const response = await api.post<ResponsePromptTemplate>('DemoChat/getPromptTemplate', ReqData); // POST 요청

    const { resultCode, resultMessage, data,  } = response.data;

    if (resultCode === 0) {
      return { resultCode, resultMessage, data };
    } else {
      console.error(`Error: ${resultMessage}`);
      return { resultCode, resultMessage, data: null };
    }
  } catch (error: any) {
    console.error('Failed to fetch character info:', error);
    return { resultCode: -1, resultMessage: 'Failed to fetch character info', data: null };
  }
};

//==== Set 채팅 프롬프트 템플릿 =======================================================================================================

// 캐릭터 설정 - Req
export interface ChatPromptTemplateData {
  prevConversationTemplate: string,
  ragTemplate: string,
  expressionTemplate: string,
}

// 캐릭터 설정 - Rec
export interface SetChatPromptTemplateRes {
  resultCode: number;
  resultMessage: string;
  data: {
    prevConversationTemplate: string;
    ragTemplate: string;
    expressionTemplate: string;
  };
}
// 캐릭터 데이터를 전송하는 새로운 POST 요청 함수 정의
export const sendChatPromptTemplateData = async (payload: ChatPromptTemplateData): Promise<ResponseAPI<SetChatPromptTemplateRes>> => {
  try {
    const response = await api.post<ResponseAPI<SetChatPromptTemplateRes>>('DemoChat/updatePromptTemplate', payload); // '/character' 엔드포인트로 POST 요청 전송
    
    if (response.data.resultCode === 0) {
      //console.log('제출 결과 성공');

      return response.data; // 성공적으로 응답을 받은 경우
    } else {
      throw new Error("SetChatPromptTemplateRes" + response.data.resultCode); // 실패 메시지 처리
    }
  } catch (error: any) {
    console.error('Error sending character data:', error);
    throw new Error('Failed to send character data. Please try again.'); // 에러 처리
  }
};

//==== Get 쇼츠 정보 =======================================================================================================
interface ReqHomeFeedShorts {
  // 요청할 때 필요한 데이터가 있다면 여기에 정의
}

interface ShortsInfo {
  characterId: number;
  shortsId: string;
  summary : string
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

    const { resultCode, resultMessage, data } = response.data;

    if (resultCode === 0) {
      return { resultCode, resultMessage, data: data.shortsInfoList }; // shortsInfoList를 반환
    } else {
      console.error(`Error: ${resultMessage}`);
      return { resultCode, resultMessage, data: null };
    }
  } catch (error: any) {
    console.error('Failed to fetch shorts info:', error);
    return { resultCode: -1, resultMessage: 'Failed to fetch shorts info', data: null };
  }
};



//==== Get Explore 정보 =======================================================================================================
interface ReqExploreSearch {
  search : string,
  onlyAdults : boolean
}

export interface ExploreInfo {
  characterId: number;
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