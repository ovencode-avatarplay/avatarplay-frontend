// src/app/Network/PromptNetwork.ts
import { AxiosInstance } from 'axios';
import api from './apiInstance';

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

// 프롬프트 템플릿 가져오기
export const sendGetPromptTemplate = async () => {
  try {
    const response = await api.post(`/DemoChat/getPromptTemplate`);
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to fetch prompt template');
  }
};

// 프롬프트 템플릿 저장
export interface ChatPromptTemplateData {
  prevConversationTemplate: string;
  ragTemplate: string;
  expressionTemplate: string;
}

export const sendChatPromptTemplateData = async (payload: ChatPromptTemplateData) => {
  try {
    const response = await api.post(`/DemoChat/updatePromptTemplate`, payload);
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to send prompt template data');
  }
};
