//import axios, {AxiosInstance} from 'axios';
import api, {ResponseAPI} from './ApiInstance';
import {ESystemError} from './ESystemError';

export interface ChattingCheatReq {
  contentId: number;
  episodeId: number;
  text: string;
}

export interface ChattingCheatRes {
  isContentInit: boolean;
  isEpisodeInit: boolean;
  resultText: string;
}

// Sending Cheat Message
export const sendMessageCheat = async (
  sendCheatMessageReq: ChattingCheatReq,
): Promise<ResponseAPI<ChattingCheatRes>> => {
  try {
    console.log('치트키 보냄 : ', sendCheatMessageReq.text);
    const response = await api.post<ResponseAPI<ChattingCheatRes>>('Test/cheat', sendCheatMessageReq);
    console.log('치트키 결과 : ', response.data.resultCode);
    if (response.data.resultCode === 0) {
      return response.data; // Return on success
    } else {
      throw new Error(response.data.resultMessage); // Error handling
    }
  } catch (error: any) {
    console.error('Error sendMessageCheat :', error);
    throw new Error(`${ESystemError.syserr_chatting_send_post}`); // Error handling
  }
};
