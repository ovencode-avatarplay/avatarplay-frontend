import api, {ResponseAPI} from './ApiInstance';
import {ESystemError} from './ESystemError';

export interface GiftStarReq {
  giftProfileId: number;
  giftStar: number;
}

export interface GiftStarRes {
  myStar: number;
}

// Sending Cheat Message
export const sendGiftStar = async (sendGiftStarReq: GiftStarReq): Promise<ResponseAPI<GiftStarRes>> => {
  try {
    console.log('스타 보냄 : ', sendGiftStarReq.giftStar);
    const response = await api.post<ResponseAPI<GiftStarRes>>('Shop/giftStar', sendGiftStarReq);
    console.log('스타 보내기  결과 : ', response.data.resultCode);
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
