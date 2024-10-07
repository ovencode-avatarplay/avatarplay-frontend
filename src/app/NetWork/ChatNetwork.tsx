// src/app/Network/ChatNetwork.tsx

import api, { ResponseAPI } from './ApiInstance'; 

// Chat Data Interfaces
export interface SendChatMessageReq {
  userID: number;
  characterID: number;
  text: string;
}

export interface SendChatMessageRes {
  streamKey: string;
}

// Sending Chat Message
export const sendMessageStream = async (sendChatMessageReq: SendChatMessageReq): Promise<ResponseAPI<SendChatMessageRes>> => {
  try {
    const response = await api.post<ResponseAPI<SendChatMessageRes>>('Chat/send', sendChatMessageReq);
    
    if (response.data.resultCode === 0) {
      return response.data; // Return on success
    } else {
      throw new Error(response.data.resultMessage); // Error handling
    }
  } catch (error: any) {
    console.error('Error sendMessageStream :', error);
    throw new Error('Failed to send message. Please try again.'); // Error handling
  }
};

// Previous Chat Message Interfaces
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

// Getting Previous Chat Messages
export const getPrevChat = async (data: GetPrevChatMessageReq): Promise<ResponseAPI<GetPrevChatMessageRes>> => {
  try {
    const response = await api.post<ResponseAPI<GetPrevChatMessageRes>>('Chat/getPrevChat', data);
    
    if (response.data.resultCode === 0) {
      return response.data; // Return on success
    } else {
      throw new Error(response.data.resultMessage); // Error handling
    }
  } catch (error: any) {
    console.error('Error fetching previous chat:', error);
    throw new Error('Failed to fetch previous chat. Please try again.'); // Error handling
  }
};

// Sending Elastic Message Interfaces
export interface ResponseChat {
  resultCode: number;        // 응답 코드
  resultMessage: string;     // 응답 메시지
  data: {
    text: string;            // 서버에서 반환하는 데이터
  };
}

// Sending Elastic Message
export const sendElasticMessage = async (payload: any): Promise<ResponseChat> => { // Change 'any' to the appropriate type
  try {
    const response = await api.post<ResponseChat>('/Bedrock/sendElastic', payload);
    
    if (response.data.resultCode === 0) {
      return response.data; // Return on success
    } else {
      throw new Error(response.data.resultMessage); // Error handling
    }
  } catch (error: any) {
    console.error('Error sending message:', error);
    throw new Error('Failed to send message. Please try again.'); // Error handling
  }
};
