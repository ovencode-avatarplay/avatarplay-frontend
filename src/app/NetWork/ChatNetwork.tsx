// src/app/Network/ChatNetwork.tsx

import api, {ResponseAPI} from './ApiInstance';
import chatEmojiTempData from '@/data/temp/chat-emoji-temp-data.json';
// 채팅 Send ##########################################
// Chat Data Interfaces
export interface SendChatMessageReq {
  userId: number;
  episodeId: number;
  text: string;
  emoticonId?: number; // optional로 설정하여 undefined 허용
}

export interface SendChatMessageRes {
  streamKey: string;
  chatId: number;
}

// Sending Chat Message
export const sendMessageStream = async (
  sendChatMessageReq: SendChatMessageReq,
): Promise<ResponseAPI<SendChatMessageRes>> => {
  try {
    const response = await api.post<ResponseAPI<SendChatMessageRes>>('Chatting/send', sendChatMessageReq);

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
// export interface MessageInfo {
//   id: number;
//   userName: string;
//   characterName: string;
//   message: string;
//   createAt: Date;
// }

// export interface GetPrevChatMessageRes {
//   messageInfoList: MessageInfo[];
// }

// export interface GetPrevChatMessageReq {
//   userID: number;
//   characterID: number;
// }

// Getting Previous Chat Messages
// export const getPrevChat = async (data: GetPrevChatMessageReq): Promise<ResponseAPI<GetPrevChatMessageRes>> => {
//   try {
//     const response = await api.post<ResponseAPI<GetPrevChatMessageRes>>('Chat/getPrevChat', data);

//     if (response.data.resultCode === 0) {
//       return response.data; // Return on success
//     } else {
//       throw new Error(response.data.resultMessage); // Error handling
//     }
//   } catch (error: any) {
//     console.error('Error fetching previous chat:', error);
//     throw new Error('Failed to fetch previous chat. Please try again.'); // Error handling
//   }
// };

// // Sending Elastic Message Interfaces
// export interface ResponseChat {
//   resultCode: number; // 응답 코드
//   resultMessage: string; // 응답 메시지
//   data: {
//     text: string; // 서버에서 반환하는 데이터
//   };
// }

// // Sending Elastic Message
// export const sendElasticMessage = async (payload: any): Promise<ResponseChat> => {
//   // Change 'any' to the appropriate type
//   try {
//     const response = await api.post<ResponseChat>('/Bedrock/sendElastic', payload);

//     if (response.data.resultCode === 0) {
//       return response.data; // Return on success
//     } else {
//       throw new Error(response.data.resultMessage); // Error handling
//     }
//   } catch (error: any) {
//     console.error('Error sending message:', error);
//     throw new Error('Failed to send message. Please try again.'); // Error handling
//   }
// };

// 채팅 Enter ##########################################

export interface MessageInfo {
  id: number;
  userName: string;
  characterName: string;
  message: string;
  createAt: Date;
}

export interface EnterEpisodeChattingReq {
  userId: number;
  episodeId: number;
}

// export interface MessageInfo {
//   id: number;
//   userName: string;
//   characterName: string;
//   message: string;
//   createAt: string;
// }

export interface EnterEpisodeChattingRes {
  iconImageUrl: string;
  episodeBgImageUrl: string;
  introPrompt: string;
  prevMessageInfoList: {
    id: number;
    userName: string;
    characterName: string;
    message: string;
    createAt: string;
  }[];
  emoticonGroupInfoList: EmoticonGroup[] | null;
}
export interface EmoticonGroup {
  id: number;
  type: number;
  name: string;
  iconOffUrl: 'string';
  iconOnUrl: 'string';
  emoticonList: {id: number; text: string; emoticonUrl: string; isFavorite: boolean}[];
}
export const sendChattingEnter = async (
  req: EnterEpisodeChattingReq,
): Promise<ResponseAPI<EnterEpisodeChattingRes>> => {
  try {
    const response = await api.post<ResponseAPI<EnterEpisodeChattingRes>>('/Chatting/enter', req);
    console.log('chatenter', req, response);

    if (response.data.resultCode === 0) {
      const responseData = response.data.data as EnterEpisodeChattingRes;

      // emoticonGroupInfoList가 null일 경우 임시 데이터를 사용
      // if (!responseData.emoticonGroupInfoList) {
      //   responseData.emoticonGroupInfoList = chatEmojiTempData.emoticonGroupInfoList;
      // }

      // 여기서 이미지 캐싱 로직 제거, URL만 반환
      return response.data;
    } else {
      throw new Error(response.data.resultMessage); // Error handling
    }
  } catch (error) {
    console.error('Error sending Enter:', error);
    throw new Error('Failed to send message. Please try again.'); // Error handling
  }
};

// 결과 요청 및 응답 인터페이스 정의 ##########################################

export interface ChattingResultReq {
  streamKey: string;
}

export interface ChattingResultData {
  nextChapterId: number;
  nextEpisodeId: number;
  nextEpisodeName: string;
}

export interface ChattingResultRes {
  resultCode: number;
  resultMessage: string;
  data: ChattingResultData;
}

// ChattingResult API 호출 함수 ##########################################

export const sendChattingResult = async (req: ChattingResultReq): Promise<ChattingResultRes> => {
  try {
    const response = await api.post<ChattingResultRes>('/Chatting/result', req);
    console.log('Chatting result request:', req, response);
    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      throw new Error(response.data.resultMessage); // 에러 핸들링
    }
  } catch (error) {
    console.error('Error sending Chatting Result:', error);
    throw new Error('Failed to send Chatting Result. Please try again.'); // 에러 핸들링
  }
};
// 즐겨찾기 이모티콘 요청 및 응답 인터페이스 정의 ##########################################

export interface FavoriteEmoticonReq {
  isRegist: boolean;
  emoticonId: number;
}

export interface FavoriteEmoticonData {
  emoticonId: number;
}

export interface FavoriteEmoticonRes {
  resultCode: number;
  resultMessage: string;
  data: FavoriteEmoticonData;
}
// FavoriteEmoticon API 호출 함수 ##########################################

export const sendFavoriteEmoticon = async (req: FavoriteEmoticonReq): Promise<FavoriteEmoticonRes> => {
  try {
    const response = await api.post<FavoriteEmoticonRes>('/Chatting/favoriteEmoticon', req);
    console.log('Favorite Emoticon request:', req, response);

    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      throw new Error(response.data.resultMessage); // 에러 핸들링
    }
  } catch (error) {
    console.error('Error sending Favorite Emoticon:', error);
    throw new Error('Failed to send Favorite Emoticon. Please try again.'); // 에러 핸들링
  }
};
