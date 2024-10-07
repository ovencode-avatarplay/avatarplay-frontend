// src/app/Network/ChatNetwork.ts
import { AxiosInstance } from 'axios';
import api from './apiInstance'; // Axios 인스턴스 공통으로 관리

// 채팅 보내기 - Req
export interface SendChatMessageReq {
  userID: number;
  characterID: number;
  text: string;
}

// 채팅 보내기 - Rec
export interface ResponseChat {
  resultCode: number;
  resultMessage: string;
  data: { text: string };
}

export interface SendChatMessageRes {
  streamKey: string;
}

export const sendMessageStream = async (sendChatMessageReq: SendChatMessageReq) => {
  try {
    const response = await api.post<ResponseChat>(`/Chat/send`, sendChatMessageReq);
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to send message');
  }
};

// 이전 채팅 가져오기
export interface MessageInfo {
  id: number;
  userName: string;
  characterName: string;
  message: string;
  createAt: Date;
}

export interface GetPrevChatMessageReq {
  userID: number;
  characterID: number;
}

export interface GetPrevChatMessageRes {
  messageInfoList: MessageInfo[];
}

export const getPrevChat = async (data: GetPrevChatMessageReq) => {
  try {
    const response = await api.post<ResponseChat>(`/Chat/getPrevChat`, data);
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to get previous chat messages');
  }
};
