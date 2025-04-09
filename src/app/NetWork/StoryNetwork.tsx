// src/app/Network/StoryNetwork.tsx

import {PublishInfo} from '@/redux-store/slices/StoryInfo';
import api, {ResponseAPI} from './ApiInstance';
import {StoryInfo as StoryInfo} from '@/redux-store/slices/StoryInfo';
import {StoryDashboardItem as StoryDashboardItem} from '@/redux-store/slices/MyStoryDashboard';

export interface ChapterInfoForStoryGet {
  id: number;
  name: string;
  episodeInfoList: EpisodeInfoForStoryGet[];
}
export interface EpisodeInfoForStoryGet {
  id: number;
  name: string;
  description: string;
  thumbnailList: string[];
  isLock: boolean;
  intimacyProgress: number;
}

// Save Story
export interface SaveStoryReq {
  languageType: string;
  storyInfo: StoryInfo;
}

export interface SaveStoryRes {
  storyId: number;
}

export const sendStorySave = async (payload: SaveStoryReq): Promise<ResponseAPI<SaveStoryRes>> => {
  try {
    const response = await api.post<ResponseAPI<SaveStoryRes>>('Story/save', payload);

    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      // ResultCode별 에러 처리
      switch (response.data.resultCode) {
        case 1:
          alert('Invalid: 유저 정보가 맞지 않습니다.');
          break;
        case 2:
          alert('NotFound: 해당 컨텐츠 정보가 없습니다.');
          break;
        case 4:
          alert('Unauthorized: 로그인 인증 정보가 없습니다.');
          break;
        default:
          alert('Unknown Error: 예상치 못한 에러가 발생했습니다.');
      }
      throw new Error(`SaveStoryRes Error: ${response.data.resultCode}`);
    }
  } catch (error: any) {
    console.error('Error sending save Story data:', error);
    throw new Error('Failed to send save Story data. Please try again.');
  }
};

// Get Story

// Get Story By ContnetId for ExploreItem
export interface GetStoryByIdReq {
  storyId: number;
  languageType: string;
}

export interface GetStoryByIdRes {
  chatCount: number;
  chatUserCount: number;
  urlLinkKey: string;
  publishInfo: PublishInfo;
  chapterInfoList: ChapterInfoForStoryGet[];
  recommandStoryInfoList: recommendStoryInfo[];
}

export interface recommendStoryInfo {
  storyId: number;
  imageUrl: string;
}

export const sendStoryByIdGet = async (payload: GetStoryByIdReq): Promise<ResponseAPI<GetStoryByIdRes>> => {
  try {
    const response = await api.post<ResponseAPI<GetStoryByIdRes>>('Story/get', payload);

    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      // ResultCode별 에러 처리
      switch (response.data.resultCode) {
        case 1:
          alert('Invalid: 해당 컨텐츠를 찾을 수 없습니다.');
          break;
        default:
          alert('Unknown Error: 예상치 못한 에러가 발생했습니다.');
      }
      throw new Error(`GetStoryByIdRes Error: ${response.data.resultCode}`);
    }
  } catch (error: any) {
    console.error('Error sending get Story data:', error);
    throw new Error('Failed to send get Story data. Please try again.');
  }
};

// Get TotalStory By StoryId
export interface GetTotalStoryByIdReq {
  storyId: number;
  language: string;
}

export interface GetTotalStoryByIdRes {
  storyInfo: StoryInfo;
}

export const sendStoryByIdGetTotal = async (
  payload: GetTotalStoryByIdReq,
): Promise<ResponseAPI<GetTotalStoryByIdRes>> => {
  try {
    const response = await api.post<ResponseAPI<GetTotalStoryByIdRes>>('Story/getTotal', payload);

    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      // ResultCode별 에러 처리
      switch (response.data.resultCode) {
        case 1:
          alert('Invalid: 해당 컨텐츠를 찾을 수 없습니다.');
          break;
        default:
          alert('Unknown Error: 예상치 못한 에러가 발생했습니다.');
      }
      throw new Error(`GetTotalStoryByIdRes Error: ${response.data.resultCode}`);
    }
  } catch (error: any) {
    console.error('Error sending get total Story data:', error);
    throw new Error('Failed to send get total Story data. Please try again.');
  }
};

// Get Storys By UserId
export interface GetStoriesByUserIdReq {
  languageType: string;
}

export interface GetStoriesByUserIdRes<> {
  storyDashBoardList: StoryDashboardItem[];
}

export const sendStoryByUserIdGet = async (
  payload: GetStoriesByUserIdReq,
): Promise<ResponseAPI<GetStoriesByUserIdRes>> => {
  try {
    const response = await api.post<ResponseAPI<GetStoriesByUserIdRes>>('Story/dashboard', payload);

    if (response.data.resultCode === 0) {
      // console.log('제출 결과 성공');
      return response.data;
    } else {
      throw new Error(`GetStoryByUserIdRes Error: ${response.data.resultCode}`);
    }
  } catch (error: any) {
    console.error('Error sending get Story data:', error);
    throw new Error('Failed to send get Story data. Please try again.');
  }
};

// Delete Story
export interface DeleteStoryReq {
  storyId: number;
}

export interface DeleteStoryRes {
  storyId: number;
}

export const sendStoryDelete = async (payload: DeleteStoryReq): Promise<ResponseAPI<DeleteStoryRes>> => {
  try {
    const response = await api.post<ResponseAPI<DeleteStoryRes>>('Story/delete', payload);

    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      // ResultCode별 에러 처리
      switch (response.data.resultCode) {
        case 1:
          alert('Invalid: 유저 정보가 맞지 않습니다.');
          break;
        case 4:
          alert('Unauthorized: 로그인 인증 정보가 없습니다.');
          break;
        default:
          alert('Unknown Error: 예상치 못한 에러가 발생했습니다.');
      }
      throw new Error(`DeleteStoryRes Error: ${response.data.resultCode}`);
    }
  } catch (error: any) {
    console.error('Error sending delete Story data:', error);
    throw new Error('Failed to send delete Story data. Please try again.');
  }
};

// getTagList
export interface GetTagListReq {}

export interface GetTagListRes {
  tagList: string[];
}

export const sendGetTagList = async (payload: GetTagListReq): Promise<ResponseAPI<GetTagListRes>> => {
  try {
    const response = await api.post<ResponseAPI<GetTagListRes>>('Story/getTagList', payload);

    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      throw new Error(`GetTagList Fail ${response.data.resultMessage}`);
    }
  } catch (error: any) {
    throw new Error(`Failed to send getTagList.`);
  }
};

export enum StoryInteractionType {
  StoryLike = 0,
  ChattingLike = 1,
}
export enum StoryInteractionState {
  Create = 1,
  Delete = 2,
}

export interface StoryLikeReq {
  type: StoryInteractionType;
  typeValueId: number; // 각각 Story, Chat의 Id
  isLike: boolean;
}

export interface StoryLikeRes {
  // empty
}

export const sendStoryLike = async (req: StoryLikeReq): Promise<ResponseAPI<StoryLikeRes>> => {
  try {
    const response = await api.post<ResponseAPI<StoryLikeRes>>('Story/like', req);

    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      // ResultCode별 에러 처리
      switch (response.data.resultCode) {
        default:
          alert('Unknown Error: 예상치 못한 에러가 발생했습니다.');
      }
      throw new Error(response.data.resultMessage);
    }
  } catch (error) {
    console.error('Error sendStoryLike:', error);
    throw new Error('Failed to sendStoryLike. Please try again.');
  }
};
