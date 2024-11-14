// src/app/Network/ChatNetwork.tsx

import {boolean} from 'valibot';
import api, {ResponseAPI} from './ApiInstance';
import chatEmojiTempData from '@/data/temp/chat-emoji-temp-data.json';
import getLocalizedText from '@/utils/getLocalizedText';
// 채팅 Send ##########################################
// Chat Data Interfaces
export interface SendChatMessageReq {
  userId: number;
  episodeId: number;
  text: string;
  emoticonId?: number; // optional로 설정하여 undefined 허용
}

// 성공적인 응답 타입
export interface SendChatMessageResSuccess {
  streamKey: string;
  chatContentId: number;
}

// 오류 응답 타입
export interface SendChatMessageResError {
  resultCode: number;
  resultMessage: string;
  data: SendChatMessageData; // 이 데이터 구조는 필요에 따라 정의
}

export interface SendChatMessageData {
  point: number;
}
const handleSuccessResponse = (response: any): SendChatMessageResSuccess => {
  return {
    streamKey: response.data.data.streamKey,
    chatContentId: response.data.data.chatContentId,
  };
};
const handleErrorResponse = (response: any): SendChatMessageResError => {
  return {
    resultCode: response.data.resultCode,
    resultMessage: response.data.resultMessage,
    data: {
      point: response.data.data?.point || 0, // 기본값 설정
    },
  };
};

export const sendMessageStream = async (
  sendChatMessageReq: SendChatMessageReq,
): Promise<SendChatMessageResSuccess | SendChatMessageResError> => {
  try {
    const response = await api.post('Chatting/send', sendChatMessageReq);

    if (response.data.resultCode === 0) {
      // 성공 응답 처리
      return handleSuccessResponse(response);
    } else {
      // 오류 응답 처리
      return handleErrorResponse(response);
    }
  } catch (error: any) {
    console.error('Error sendMessageStream:', error);
    throw new Error('Failed to send message. Please try again.'); // Error handling
  }
};
// 요청 데이터 타입
interface RetryStreamRequest {
  chatContentId: number;
  episodeId: number;
  text: string;
}

// 성공적인 응답 타입
export interface RetryStreamResSuccess {
  streamKey: string; // StreamKey가 응답으로 포함됩니다.
}

// 오류 응답 타입
export interface RetryStreamResError {
  resultCode: number;
  resultMessage: string;
}

const handleRetrySuccessResponse = (response: any): RetryStreamResSuccess => {
  return {
    streamKey: response.data.data.streamKey, // 응답에서 streamKey를 추출
  };
};

const handleRetryErrorResponse = (response: any): RetryStreamResError => {
  return {
    resultCode: response.data.resultCode,
    resultMessage: response.data.resultMessage,
  };
};

export const retryStream = async (
  retryStreamRequest: RetryStreamRequest,
): Promise<RetryStreamResSuccess | RetryStreamResError> => {
  try {
    // retryStream API 호출 (POST 메서드로 변경하고, 요청 본문(body)에 데이터 전송)
    const response = await api.post('Chatting/retry', retryStreamRequest); // body로 데이터 전달

    if (response.data.resultCode === 0) {
      // 성공 응답 처리
      return handleRetrySuccessResponse(response);
    } else {
      // 오류 응답 처리
      return handleRetryErrorResponse(response);
    }
  } catch (error: any) {
    console.error('Error retrying stream:', error);
    throw new Error('Failed to retry stream. Please try again.');
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
  emoticonUrl: string;
  createAt: Date;
}

export interface EnterEpisodeChattingReq {
  episodeId: number;
}

export interface UrlEnterEpisodeChattingReq {
  urlLinkKey: string;
}

// export interface MessageInfo {
//   id: number;
//   userName: string;
//   characterName: string;
//   message: string;
//   createAt: string;
// }

// URL 방식이든 아니는 Enter Respons 받는 형식은 같은걸 사용한다.
// 만약 달라지면 따로 분리해서 만들어주자.
export interface EnterEpisodeChattingRes {
  contentId: number;
  episodeId: number;
  contentName: string;
  episodeName: string;
  iconImageUrl: string;
  episodeBgImageUrl: string;
  introPrompt: string;
  prevMessageInfoList: {
    id: number;
    userName: string;
    characterName: string;
    message: string;
    emoticonUrl: string;
    createAt: string;
  }[];
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

export const sendChattingEnterUrl = async (
  req: UrlEnterEpisodeChattingReq,
): Promise<ResponseAPI<EnterEpisodeChattingRes>> => {
  try {
    const response = await api.post<ResponseAPI<EnterEpisodeChattingRes>>('/Chatting/urlEnter', req);
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
  nextEpisodeThumbnail: string;
  nextEpisodeDescription: string;
  changeBackgroundThumbnail: string;
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

// 이모티콘 그룹 요청 및 응답 인터페이스 정의 ##########################################

export interface EmoticonGroupInfo {
  id: number;
  type: number;
  name: string;
  iconOffUrl: string;
  iconOnUrl: string;
  emoticonList: {
    id: number;
    text: string;
    emoticonUrl: string;
    isFavorite: boolean;
  }[];
}

export interface EmoticonGroupRes {
  resultCode: number;
  resultMessage: string;
  data: {
    emoticonGroupInfoList: EmoticonGroupInfo[];
  };
}

// 이모티콘 그룹 API 호출 함수 ##########################################

export const fetchEmoticonGroups = async (): Promise<EmoticonGroupRes> => {
  try {
    const response = await api.post<EmoticonGroupRes>('/Resource/subMenu', {});
    console.log('Emoticon Group request:', response);

    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      // 서버에서 애러코드에 해당하는 문자열을 시스템메시지에 출력해줘야 한다.
      throw new Error(response.data.resultMessage); // 에러 메시지 처리
    }
  } catch (error) {
    // 여기가 네트워크 오류에 해당하는 부분
    // 서버와 연결이 되지 않을때 시스템 메시지 처리--
    // 하지만 어떤 APi를 사용했을때였는지 까지도 시스템 메시지에 추가해주자.
    // ex) 서버와의 연결에 실패했습니다. 잠시 후 다시 이용해 주세요
    //     error.status 값

    console.error('Error fetching Emoticon Group:', error);
    throw new Error('Failed to fetch Emoticon Groups. Please try again.'); // 에러 메시지 처리
  }
};

// Chatting 수정 ##########################################

export interface ModifyChatReq {
  chatId: number;
  originText: string;
  modifyText: string;
}

export interface ModifyChatRes {
  chatId: number;
  originText: string;
  modifyText: string;
}

export const modifyChatting = async (req: ModifyChatReq): Promise<ResponseAPI<ModifyChatRes>> => {
  try {
    const response = await api.post<ResponseAPI<ModifyChatRes>>('/Chatting/modify', req);
    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      throw new Error(response.data.resultMessage); // Error handling
    }
  } catch (error) {
    throw new Error('Failed to modify chatting. Please try again.'); // Error handling
  }
};

// Chatting 삭제 ##########################################

export interface DeleteChatReq {
  chatId: number;
  deleteText: string;
}

export interface DeleteChatRes {
  chatId: number;
}

export const deleteChatting = async (req: DeleteChatReq): Promise<ResponseAPI<DeleteChatRes>> => {
  try {
    const response = await api.post<ResponseAPI<DeleteChatRes>>('/Chatting/delete', req);
    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      throw new Error(response.data.resultMessage); // Error handling
    }
  } catch (error) {
    throw new Error('Failed to delete chatting. Please try again.'); // Error handling
  }
};

// Chatting 조회 ##########################################

export interface GetChatReq {
  chatCotnteId: number; // 요청 파라미터에 맞춘 필드명
  episodeId: number;
}

export interface GetChatRes {
  resultCode: number;
  resultMessage: string;
  data: {
    messageInfo: MessageInfo; //다른데 같은거 쓰고 있음
  };
}

export const getChatting = async (req: GetChatReq): Promise<ResponseAPI<GetChatRes>> => {
  try {
    const response = await api.post<ResponseAPI<GetChatRes>>('/api/v1/Chatting/get', req);
    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      throw new Error(response.data.resultMessage); // Error handling
    }
  } catch (error) {
    throw new Error('Failed to fetch chatting details. Please try again.'); // Error handling
  }
};
