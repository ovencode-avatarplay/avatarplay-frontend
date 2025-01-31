// src/app/Network/ChatNetwork.tsx

import api, {ResponseAPI} from './ApiInstance';
import {ESystemError} from './ESystemError';

// 채팅 Send ##########################################
// Chat Data Interfaces
export interface SendChatMessageReq {
  episodeId: number;
  emoticonId?: number; // optional로 설정하여 undefined 허용
  text: string;
  isRegenerate?: boolean;
  regenerateChatId?: number;
  streamKey?: string;
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
      // ResultCode별 에러 처리
      switch (response.data.resultCode) {
        case 10:
          alert('DBError: ResultMessage를 찾을 수 없습니다.');
          break;
        default:
          alert('Unknown Error: 예상치 못한 에러가 발생했습니다.');
      }
      // 오류 응답 처리
      return handleErrorResponse(response);
    }
  } catch (error: any) {
    console.error('Error sending message stream:', error);
    throw new Error(`${ESystemError.syserr_chatting_send_post}`);
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

// 서버에서 사용하는 enum
export enum ChatType {
  Answer = 0,
  SystemText = 1,
  TriggerInfo = 2,
  Intro = 3,
}

export interface MessageInfo {
  id: number;
  userName: string;
  characterName: string;
  chatType: ChatType;
  message: string;
  emoticonUrl: string;
  triggerMediaState: number;
  mediaUrlList: string[];
  createAt: Date;
}

export interface EnterEpisodeChattingReq {
  episodeId: number;
}

export interface UrlEnterEpisodeChattingReq {
  urlLinkKey: string;
  episodeId: number;
  language: string;
  isUrlEnter: boolean;
}

// URL 방식이든 아니는 Enter Respons 받는 형식은 같은걸 사용한다.
// 만약 달라지면 따로 분리해서 만들어주자.
export interface EnterEpisodeChattingRes {
  contentId: number;
  episodeId: number;
  streamKey: string;
  nextEpisodeId: number;
  nextEpisodeName: string;
  contentName: string;
  episodeName: string;
  characterImageUrl: string;
  episodeBgImageUrl: string;
  introPrompt: string;
  prevMessageInfoList: MessageInfo[];
}

export const sendChattingEnter = async (
  req: EnterEpisodeChattingReq,
): Promise<ResponseAPI<EnterEpisodeChattingRes>> => {
  try {
    const response = await api.post<ResponseAPI<EnterEpisodeChattingRes>>('/Chatting/enter', req);
    console.log('chatenter', req, response);

    if (response.data.resultCode === 0) {
      const responseData = response.data.data as EnterEpisodeChattingRes;
      console.log('enterData', response.data.data);
      // 여기서 이미지 캐싱 로직 제거, URL만 반환
      return response.data;
    } else {
      // ResultCode별 에러 처리
      switch (response.data.resultCode) {
        case 10:
          alert('DBError: ResultMessage를 찾을 수 없습니다.');
          break;
        case 1:
          alert('Invalid: 해당 컨텐츠의 에피소드가 활성화되지 않았습니다.');
          break;
        default:
          alert('Unknown Error: 예상치 못한 에러가 발생했습니다.');
      }
      throw new Error(response.data.resultMessage);
    }
  } catch (error) {
    console.error('Error sending Enter:', error);
    throw new Error(`${ESystemError.syserr_chatting_send_post}`); // Error handling
  }
};

export const sendChattingEnterUrl = async (
  req: UrlEnterEpisodeChattingReq,
): Promise<ResponseAPI<EnterEpisodeChattingRes>> => {
  try {
    const response = await api.post<ResponseAPI<EnterEpisodeChattingRes>>('/Chatting/urlEnter', req);

    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      // ResultCode별 에러 처리
      switch (response.data.resultCode) {
        case 10:
          alert('DBError: ResultMessage를 찾을 수 없습니다.');
          break;
        case 1:
          alert('Invalid: 해당 컨텐츠의 에피소드가 활성화되지 않았습니다.');
          break;
        default:
          alert('Unknown Error: 예상치 못한 에러가 발생했습니다.');
      }
      throw new Error(response.data.resultMessage);
    }
  } catch (error) {
    console.error('Error sending Enter:', error);
    throw new Error(`${ESystemError.syserr_chatting_send_post}`); // Error handling
  }
};

// 결과 요청 및 응답 인터페이스 정의 ##########################################

export interface ChattingResultReq {
  streamKey: string;
}

export interface ChattingCharacterData {
  name: string;
  introduction: string;
  description: string;
  imageUrl: string;
}
// API Response Types
export interface ChattingResultRes {
  resultCode: number;
  resultMessage: string;
  data: ChatData;
}

export interface ChatData {
  chatResultInfoList: ChatResultInfo[];
}

export interface ChatResultInfo {
  type: number; //enum ChatType  <-- 검색해서 참고..   서버에서 주고있음
  systemText: string;
  triggerActionInfo: TriggerActionInfo;
}

export interface TriggerActionInfo {
  triggerNextEpisodeInfo: TriggerNextEpisodeInfo;
  changeCharacterInfo: ChangeCharacterInfo;
  triggerMediaInfoList: TriggerMediaInfo[];
}

export interface TriggerNextEpisodeInfo {
  nextChapterId: number;
  nextEpisodeId: number;
  nextEpisodeName: string;
  nextEpisodeBackgroundImageUrl: string;
  nextEpisodeDescription: string;
}

export interface ChangeCharacterInfo {
  name: string;
  introduction: string;
  description: string;
  imageUrl: string;
}

export interface TriggerMediaInfo {
  triggerMediaState: number;
  triggerMediaUrlList: string[];
}

// ChattingResult API 호출 함수 ##########################################
export const sendChattingResult = async (req: ChattingResultReq): Promise<ChattingResultRes> => {
  try {
    const response = await api.post<ChattingResultRes>('/Chatting/result', req);
    console.log('Chatting result request:', req, response);

    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      // ResultCode별 에러 처리
      switch (response.data.resultCode) {
        case 1:
          alert('Invalid: 번호의 키가 존재하지 않습니다.');
          break;
        case 10:
          alert('DBError: ResultMessage를 찾을 수 없습니다.');
          break;
        default:
          alert('Unknown Error: 예상치 못한 에러가 발생했습니다.');
      }
      throw new Error(response.data.resultMessage);
    }
  } catch (error) {
    console.error('Error sending Chatting Result:', error);
    throw new Error('Failed to send Chatting Result. Please try again.');
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
      // ResultCode별 에러 처리
      switch (response.data.resultCode) {
        case 1:
          alert('Invalid: 즐겨찾기 되어 있지 않은 이모티콘입니다.');
          break;
        case 10:
          alert('DBError: ResultMessage를 찾을 수 없습니다.');
          break;
        default:
          alert('Unknown Error: 예상치 못한 에러가 발생했습니다.');
      }
      throw new Error(response.data.resultMessage);
    }
  } catch (error) {
    console.error('Error sending Favorite Emoticon:', error);
    throw new Error('Failed to send Favorite Emoticon. Please try again.');
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
      // ResultCode별 에러 처리
      switch (response.data.resultCode) {
        case 1:
          alert('Invalid: 채팅에 수정할 문구가 존재하지 않습니다.');
          break;
        case 10:
          alert('DBError: ResultMessage를 찾을 수 없습니다.');
          break;
        default:
          alert('Unknown Error: 예상치 못한 에러가 발생했습니다.');
      }
      throw new Error(response.data.resultMessage);
    }
  } catch (error) {
    console.error('Error modifying chatting:', error);
    throw new Error('Failed to modify chatting. Please try again.');
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
      // ResultCode별 에러 처리
      switch (response.data.resultCode) {
        case 1:
          alert('Invalid: 채팅에 삭제할 문구가 존재하지 않습니다.');
          break;
        case 10:
          alert('DBError: ResultMessage를 찾을 수 없습니다.');
          break;
        default:
          alert('Unknown Error: 예상치 못한 에러가 발생했습니다.');
      }
      throw new Error(response.data.resultMessage);
    }
  } catch (error) {
    console.error('Error deleting chatting:', error);
    throw new Error('Failed to delete chatting. Please try again.');
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

// Chatting 추천 보내기 ##########################################

export interface RequestAiQuestionReq {
  episodeId: number;
}

export interface RequestAiQuestionRes {
  questionList: string[];
}

export const recommendQuestion = async (req: RequestAiQuestionReq): Promise<ResponseAPI<RequestAiQuestionRes>> => {
  try {
    const response = await api.post<ResponseAPI<RequestAiQuestionRes>>('Chatting/aiQuestion', req);

    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      // ResultCode별 에러 처리
      switch (response.data.resultCode) {
        case 1:
          alert('Invalid: 지난 대화가 없어 다음 질문을 생성할 수 없습니다.');
          break;
        case 3:
          alert('NotExist: LLM 모델을 찾을 수 없습니다.');
          break;
        case 10:
          alert('DBError: ResultMessage를 찾을 수 없습니다.');
          break;
        default:
          alert('Unknown Error: 예상치 못한 에러가 발생했습니다.');
      }
      throw new Error(response.data.resultMessage);
    }
  } catch (error) {
    console.error('Error recommending question:', error);
    throw new Error('Failed to recommendQuestion. Please try again.');
  }
};
