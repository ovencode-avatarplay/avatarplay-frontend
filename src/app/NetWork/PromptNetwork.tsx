// src/app/Network/PromptNetwork.ts

import api, {ResponseAPI} from './ApiInstance';

export interface CustomModulesInfo {
  selectPromptId: number;
  selectLorebookId: number;
}

export interface PromptInfo {
  id: number;
  name: string;
}

export interface LorebookInfo {
  id: number;
  name: string;
}

// 채팅 프롬프트 템플릿 요청
export interface ReqPromptTemplate {}

export interface ResponsePromptTemplate {
  resultCode: number;
  resultMessage: string;
  data: {
    prevConversationTemplate: string;
    ragTemplate: string;
    expressionTemplate: string;
  };
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

// 프롬프트 템플릿 가져오기
export const sendGetPromptTemplate = async () => {
  try {
    const response = await api.post(`/DemoChat/getPromptTemplate`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch prompt template');
  }
};

// 프롬프트 템플릿 저장
export interface ChatPromptTemplateData {
  prevConversationTemplate: string;
  ragTemplate: string;
  expressionTemplate: string;
}

export const sendChatPromptTemplateData = async (
  payload: ChatPromptTemplateData,
): Promise<ResponseAPI<SetChatPromptTemplateRes>> => {
  try {
    const response = await api.post<ResponseAPI<SetChatPromptTemplateRes>>('DemoChat/updatePromptTemplate', payload); // '/character' 엔드포인트로 POST 요청 전송

    if (response.data.resultCode === 0) {
      //console.log('제출 결과 성공');

      return response.data; // 성공적으로 응답을 받은 경우
    } else {
      throw new Error('SetChatPromptTemplateRes' + response.data.resultCode); // 실패 메시지 처리
    }
  } catch (error) {
    console.error('Error sending character data:', error);
    throw new Error('Failed to send character data. Please try again.'); // 에러 처리
  }
};
