// src/app/Network/ContentNetwork.tsx

import {PublishInfo} from '@/redux-store/slices/ContentInfo';
import api, {ResponseAPI} from './ApiInstance';
import {ContentInfo} from '@/redux-store/slices/ContentInfo';
import {ContentDashboardItem} from '@/redux-store/slices/MyContentDashboard';

export interface ChapterInfoForContentGet {
  id: number;
  name: string;
  episodeInfoList: EpisodeInfoForContentGet[];
}
export interface EpisodeInfoForContentGet {
  id: number;
  name: string;
  description: string;
  thumbnailList: string[];
  isLock: boolean;
  intimacyProgress: number;
}

// Save Content
export interface SaveContentReq {
  contentInfo: ContentInfo;
}

export interface SaveContentRes {
  contentId: number;
}

export const sendContentSave = async (payload: SaveContentReq): Promise<ResponseAPI<SaveContentRes>> => {
  try {
    const response = await api.post<ResponseAPI<SaveContentRes>>('Content/save', payload);

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
      throw new Error(`SaveContentRes Error: ${response.data.resultCode}`);
    }
  } catch (error: any) {
    console.error('Error sending save content data:', error);
    throw new Error('Failed to send save content data. Please try again.');
  }
};

// Get Content

// Get Content By ContnetId for ExploreItem
export interface GetContentByIdReq {
  contentId: number;
  language: string;
}

export interface GetContentByIdRes {
  chatCount: number;
  chatUserCount: number;
  urlLinkKey: string;
  publishInfo: PublishInfo;
  chapterInfoList: ChapterInfoForContentGet[];
  recommandContentInfoList: recommendContentInfo[];
}

export interface recommendContentInfo {
  contentId: number;
  imageUrl: string;
}

export const sendContentByIdGet = async (payload: GetContentByIdReq): Promise<ResponseAPI<GetContentByIdRes>> => {
  try {
    const response = await api.post<ResponseAPI<GetContentByIdRes>>('Content/get', payload);

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
      throw new Error(`GetContentByIdRes Error: ${response.data.resultCode}`);
    }
  } catch (error: any) {
    console.error('Error sending get content data:', error);
    throw new Error('Failed to send get content data. Please try again.');
  }
};

// Get TotalContent By ContentId
export interface GetTotalContentByIdReq {
  contentId: number;
  language: string;
}

export interface GetTotalContentByIdRes {
  contentInfo: ContentInfo;
}

export const sendContentByIdGetTotal = async (
  payload: GetTotalContentByIdReq,
): Promise<ResponseAPI<GetTotalContentByIdRes>> => {
  try {
    const response = await api.post<ResponseAPI<GetTotalContentByIdRes>>('Content/getTotal', payload);

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
      throw new Error(`GetTotalContentByIdRes Error: ${response.data.resultCode}`);
    }
  } catch (error: any) {
    console.error('Error sending get total content data:', error);
    throw new Error('Failed to send get total content data. Please try again.');
  }
};

// Get Contents By UserId
export interface GetContentsByUserIdReq {}

export interface GetContentsByUserIdRes<> {
  contentDashBoardList: ContentDashboardItem[];
}

export const sendContentByUserIdGet = async (
  payload: GetContentsByUserIdReq,
): Promise<ResponseAPI<GetContentsByUserIdRes>> => {
  try {
    const response = await api.post<ResponseAPI<GetContentsByUserIdRes>>('Content/dashboard', payload);

    if (response.data.resultCode === 0) {
      // console.log('제출 결과 성공');
      return response.data;
    } else {
      throw new Error(`GetContentByUserIdRes Error: ${response.data.resultCode}`);
    }
  } catch (error: any) {
    console.error('Error sending get content data:', error);
    throw new Error('Failed to send get content data. Please try again.');
  }
};

// Delete Content
export interface DeleteContentReq {
  contentId: number;
}

export interface DeleteContentRes {
  contentId: number;
}

export const sendContentDelete = async (payload: DeleteContentReq): Promise<ResponseAPI<DeleteContentRes>> => {
  try {
    const response = await api.post<ResponseAPI<DeleteContentRes>>('Content/delete', payload);

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
      throw new Error(`DeleteContentRes Error: ${response.data.resultCode}`);
    }
  } catch (error: any) {
    console.error('Error sending delete content data:', error);
    throw new Error('Failed to send delete content data. Please try again.');
  }
};

// getTagList
export interface GetTagListReq {}

export interface GetTagListRes {
  tagList: string[];
}

export const sendGetTagList = async (payload: GetTagListReq): Promise<ResponseAPI<GetTagListRes>> => {
  try {
    const response = await api.post<ResponseAPI<GetTagListRes>>('Content/getTagList', payload);

    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      throw new Error(`GetTagList Fail ${response.data.resultMessage}`);
    }
  } catch (error: any) {
    throw new Error(`Failed to send getTagList.`);
  }
};
