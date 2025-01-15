// src/app/Network/ShortsNetwork.ts

import api, {ResponseAPI} from './ApiInstance';

// 쇼츠 정보 타입
export interface ShortsInfo {
  characterId: number;
  shortsId: string;
  summary: string;
  thumbnailList: string[];
}

interface ResponseHomeFeedShorts {
  resultCode: number;
  resultMessage: string;
  data: {
    shortsInfoList: ShortsInfo[];
  };
}

export const sendGetHomeFeedShorts = async (): Promise<{
  resultCode: number;
  resultMessage: string;
  data: ShortsInfo[] | null; // 변경된 부분
}> => {
  try {
    // GET 요청을 보내기 위한 기본적인 정의
    const response = await api.get<ResponseHomeFeedShorts>('/Home/shorts'); // GET 요청으로 수정

    const {resultCode, resultMessage, data} = response.data;

    if (resultCode === 0) {
      return {resultCode, resultMessage, data: data.shortsInfoList}; // shortsInfoList를 반환
    } else {
      console.error(`Error: ${resultMessage}`);
      return {resultCode, resultMessage, data: null};
    }
  } catch (error) {
    console.error('Failed to fetch shorts info:', error);
    return {resultCode: -1, resultMessage: 'Failed to fetch shorts info', data: null};
  }
};

export interface FeedInfo {
  id: number;
  urlLinkKey: number;
  mediaState: number;
  mediaUrlList: string[];
  description: string;
  hashTag: string;
  commentCount: number;
  likeCount: number;
  isLike: boolean;
  isDisLike: boolean;
  playTime: string;
  characterProfileId: number;
  characterProfileName: string;
  characterProfileUrl: string;
}

interface RequestCreateFeed {
  feedInfo: FeedInfo;
}

interface ResponseCreateFeed {
  resultCode: number;
  resultMessage: string;
  data: any; // API 응답 데이터 구조에 따라 수정 가능
}

/**
 * Feed 생성 API 호출 함수
 * @param feedInfo - 생성할 Feed 정보
 * @returns API 응답 결과
 */
export const sendCreateFeed = async (
  feedInfo: FeedInfo,
): Promise<{resultCode: number; resultMessage: string; data: any | null}> => {
  try {
    // POST 요청 전송
    const response = await api.post<ResponseCreateFeed>('/Feed/create', {
      feedInfo,
    });

    const {resultCode, resultMessage, data} = response.data;

    if (resultCode === 0) {
      return {resultCode, resultMessage, data};
    } else {
      console.error(`Error: ${resultMessage}`);
      return {resultCode, resultMessage, data: null};
    }
  } catch (error) {
    console.error('Failed to create feed:', error);
    return {
      resultCode: -1,
      resultMessage: 'Failed to create feed',
      data: null,
    };
  }
};
// Recommend Feed API Types
export interface RecommendFeedReq {
  language: string;
}

export interface RecommendFeedRes {
  feedInfoList: FeedInfo[];
}

/**
 * 추천 피드 가져오기
 * @param payload 요청 본문에 포함할 데이터 (언어 정보)
 * @returns API 응답 결과
 */
export const sendGetRecommendFeed = async (payload: RecommendFeedReq): Promise<ResponseAPI<RecommendFeedRes>> => {
  try {
    // POST 요청으로 변경
    const response = await api.post<ResponseAPI<RecommendFeedRes>>('/Feed/recommend', payload);

    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      throw new Error(`RecommendFeedRes Error: ${response.data.resultCode}`);
    }
  } catch (error) {
    console.error('Error fetching recommended feeds:', error);
    throw new Error('Failed to fetch recommended feeds. Please try again.');
  }
};

// GET Feed List API 호출 함수
export const sendGetFeedList = async (
  characterProfileId: number,
): Promise<{resultCode: number; resultMessage: string; data: FeedInfo[] | null}> => {
  try {
    const response = await api.post('/Feed/getFeedList', {characterProfileId});
    const {resultCode, resultMessage, data} = response.data;

    if (resultCode === 0) {
      return {resultCode, resultMessage, data: data?.feedInfoList || null};
    } else {
      console.error(`Error: ${resultMessage}`);
      return {resultCode, resultMessage, data: null};
    }
  } catch (error) {
    console.error('Failed to fetch feed list:', error);
    return {
      resultCode: -1,
      resultMessage: 'Failed to fetch feed list',
      data: null,
    };
  }
};

// Feed View API 호출 함수
export const sendFeedView = async (
  feedId: number,
): Promise<{resultCode: number; resultMessage: string; data: FeedInfo | null}> => {
  try {
    const response = await api.post('/Feed/view', {feedId});
    const {resultCode, resultMessage, data} = response.data;

    if (resultCode === 0) {
      return {resultCode, resultMessage, data: data?.feedInfo || null};
    } else {
      console.error(`Error: ${resultMessage}`);
      return {resultCode, resultMessage, data: null};
    }
  } catch (error) {
    console.error('Failed to view feed:', error);
    return {
      resultCode: -1,
      resultMessage: 'Failed to view feed',
      data: null,
    };
  }
};

// Feed Like API 호출 함수
export const sendFeedLike = async (
  feedId: number,
  isLike: boolean,
): Promise<{
  resultCode: number;
  resultMessage: string;
  data: {feedId: number; isLike: boolean; likeCount: number} | null;
}> => {
  try {
    const response = await api.post('/Feed/like', {feedId, isLike});
    const {resultCode, resultMessage, data} = response.data;

    if (resultCode === 0) {
      return {
        resultCode,
        resultMessage,
        data: data || null, // 데이터가 없을 경우 null 반환
      };
    } else {
      console.error(`Error: ${resultMessage}`);
      return {
        resultCode,
        resultMessage,
        data: null, // 실패 시 data를 null로 반환
      };
    }
  } catch (error) {
    console.error('Failed to like feed:', error);
    return {
      resultCode: -1,
      resultMessage: 'Failed to like feed',
      data: null,
    };
  }
};

// Feed Like API 호출 함수
export const sendFeedDisLike = async (
  feedId: number,
  isDisLike: boolean,
): Promise<{resultCode: number; resultMessage: string}> => {
  try {
    const response = await api.post('/Feed/dislike', {feedId, isDisLike});
    const {resultCode, resultMessage} = response.data;

    if (resultCode === 0) {
      return {resultCode, resultMessage};
    } else {
      console.error(`Error: ${resultMessage}`);
      return {resultCode, resultMessage};
    }
  } catch (error) {
    console.error('Failed to like feed:', error);
    return {
      resultCode: -1,
      resultMessage: 'Failed to like feed',
    };
  }
};

// Feed Share API 호출 함수
export const sendFeedShare = async (feedId: number): Promise<{resultCode: number; resultMessage: string}> => {
  try {
    const response = await api.post('/Feed/share', {feedId});
    const {resultCode, resultMessage} = response.data;

    if (resultCode === 0) {
      return {resultCode, resultMessage};
    } else {
      console.error(`Error: ${resultMessage}`);
      return {resultCode, resultMessage};
    }
  } catch (error) {
    console.error('Failed to share feed:', error);
    return {
      resultCode: -1,
      resultMessage: 'Failed to share feed',
    };
  }
};

// 댓글 정보 타입 정의
export interface CommentInfo {
  email: string;
  commentId: number;
  content: string;
  parentCommentId: number;
  userName: string;
  likeCount: number;
  isLike: boolean;
  isDisLike: boolean;
  isModify: boolean;
  updatedAt: string;
  replies: ReplieInfo[];
}

// 대댓글 정보
export interface ReplieInfo {
  commentId: number;
  content: string;
  parentCommentId: number;
  userName: string;
  likeCount: number;
  isLike: boolean;
  isDisLike: boolean;
  isModify: boolean;
  updatedAt: string;
}

// 댓글 추가하기
export interface AddCommentReq {
  feedId: number;
  parentCommentId: number;
  content: string;
}

export interface AddCommentRes {
  feedId: number;
  parentCommentId: number;
  userName: string;
  content: string;
  createAt: string;
}

export const sendAddComment = async (payload: AddCommentReq): Promise<ResponseAPI<AddCommentRes>> => {
  try {
    const response = await api.post<ResponseAPI<AddCommentRes>>('/Feed/addComment', payload);

    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      throw new Error(`AddComment Error: ${response.data.resultCode}`);
    }
  } catch (error) {
    console.error('Error adding comment:', error);
    throw new Error('Failed to add comment. Please try again.');
  }
};

// 댓글 수정하기
export interface UpdateCommentReq {
  commentId: number;
  content: string;
}

export interface UpdateCommentRes {
  commentInfo: CommentInfo;
}

export const sendUpdateComment = async (payload: UpdateCommentReq): Promise<ResponseAPI<UpdateCommentRes>> => {
  try {
    const response = await api.post<ResponseAPI<UpdateCommentRes>>('/Feed/updateComment', payload);

    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      throw new Error(`UpdateComment Error: ${response.data.resultCode}`);
    }
  } catch (error) {
    console.error('Error updating comment:', error);
    throw new Error('Failed to update comment. Please try again.');
  }
};

// 댓글 좋아요
export interface CommentLikeReq {
  commentId: number;
  isLike: boolean;
}

export interface CommentLikeRes {
  commentId: number;
  isLike: boolean;
  likeCount: number;
}

export const sendCommentLike = async (payload: CommentLikeReq): Promise<ResponseAPI<CommentLikeRes>> => {
  try {
    const response = await api.post<ResponseAPI<CommentLikeRes>>('/Feed/commentLike', payload);

    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      throw new Error(`CommentLike Error: ${response.data.resultCode}`);
    }
  } catch (error) {
    console.error('Error liking comment:', error);
    throw new Error('Failed to like comment. Please try again.');
  }
};

// 댓글 싫어요
export interface CommentDislikeReq {
  commentId: number;
  isDisLike: boolean;
}

export interface CommentDislikeRes {
  commentId: number;
  isDisLike: boolean;
}

export const sendCommentDislike = async (payload: CommentDislikeReq): Promise<ResponseAPI<CommentDislikeRes>> => {
  try {
    const response = await api.post<ResponseAPI<CommentDislikeRes>>('/Feed/commentDislike', payload);

    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      throw new Error(`CommentDislike Error: ${response.data.resultCode}`);
    }
  } catch (error) {
    console.error('Error disliking comment:', error);
    throw new Error('Failed to dislike comment. Please try again.');
  }
};

// 댓글 리스트 가져오기
export interface GetCommentListReq {
  feedId: number;
}

export interface GetCommentListRes {
  commentInfoList: CommentInfo[];
}

export const sendGetCommentList = async (payload: GetCommentListReq): Promise<ResponseAPI<GetCommentListRes>> => {
  try {
    const response = await api.post<ResponseAPI<GetCommentListRes>>('/Feed/getCommentList', payload);

    console.log('asd', response);

    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      throw new Error(`GetCommentList Error: ${response.data.resultCode}`);
    }
  } catch (error) {
    console.error('Error fetching comment list:', error);
    throw new Error('Failed to fetch comment list. Please try again.');
  }
};

// Feed Get API 요청 타입
export interface GetFeedReq {
  urlLinkKey: string;
  languageType: string;
}
// Feed Get API 응답 타입
export interface GetFeedRes {
  feedInfo: FeedInfo;
}
/**
 * 특정 피드 가져오기
 * @param payload 요청 본문에 포함할 데이터 (urlLinkKey, languageType)
 * @returns API 응답 결과
 */
export const sendGetFeed = async (
  payload: GetFeedReq,
): Promise<{
  resultCode: number;
  resultMessage: string;
  data: GetFeedRes | null;
}> => {
  try {
    // POST 요청 실행
    const response = await api.post('/Feed/get', payload);
    const {resultCode, resultMessage, data} = response.data;

    if (resultCode === 0) {
      return {resultCode, resultMessage, data: data || null}; // 성공 시 데이터 반환
    } else {
      console.error(`Error: ${resultMessage}`);
      return {resultCode, resultMessage, data: null}; // 실패 시 데이터 null
    }
  } catch (error) {
    console.error('Failed to fetch feed:', error);
    return {
      resultCode: -1,
      resultMessage: 'Failed to fetch feed',
      data: null,
    };
  }
};
