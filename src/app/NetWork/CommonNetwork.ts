// src/app/Network/ShortsNetwork.ts

import api, {ResponseAPI} from './ApiInstance';

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
  userImage: string;
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
  userImage: string;
}

// 댓글 추가하기
export interface AddCommentReq {
  typeValueId: number;
  type: CommentContentType;
  parentCommentId: number;
  comment: string;
}
export enum CommentContentType {
  Feed,
  Content,
  Episode,
}
export interface AddCommentRes {
  commentId: number;
  parentCommentId: number;
  userName: string;
  comment: string;
  createAt: string;
}

export const sendAddComment = async (payload: AddCommentReq): Promise<ResponseAPI<AddCommentRes>> => {
  try {
    const response = await api.post<ResponseAPI<AddCommentRes>>('/Common/addComment', payload);

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
    const response = await api.post<ResponseAPI<UpdateCommentRes>>('/Common/updateComment', payload);

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
    const response = await api.post<ResponseAPI<CommentLikeRes>>('/Common/commentLike', payload);

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
    const response = await api.post<ResponseAPI<CommentDislikeRes>>('/Common/commentDislike', payload);

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
  typeValueId: number;
  type: CommentContentType;
}

export interface GetCommentListRes {
  commentInfoList: CommentInfo[];
}

export const sendGetCommentList = async (payload: GetCommentListReq): Promise<ResponseAPI<GetCommentListRes>> => {
  try {
    const response = await api.post<ResponseAPI<GetCommentListRes>>('/Common/getCommentList', payload);

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

// Common Bookmark API 요청 타입
export interface FeedBookmarkReq {
  typeValueId: number;
  type: CommentContentType;
  isSave: boolean;
}

// Common Bookmark API 응답 타입
export interface FeedBookmarkRes {
  resultCode: number;
  resultMessage: string;
  data: {}; // 빈 객체
}

/**
 * 피드 북마크 API 호출
 * @param payload 요청 본문에 포함할 데이터 (feedId, isSave)
 * @returns API 응답 결과
 */
export const sendFeedBookmark = async (payload: FeedBookmarkReq): Promise<FeedBookmarkRes> => {
  try {
    const response = await api.post('/Common/bookmark', payload);
    const {resultCode, resultMessage, data} = response.data;

    return {
      resultCode,
      resultMessage,
      data: data || {}, // 데이터가 없을 경우 빈 객체 반환
    };
  } catch (error) {
    console.error('Failed to bookmark Common:', error);
    return {
      resultCode: -1,
      resultMessage: 'Failed to bookmark Common',
      data: {},
    };
  }
};
// Get Comment API 요청 타입
export interface GetCommentReq {
  commentId: number; // 가져올 댓글 ID
}

// Get Comment API 응답 타입
export interface GetCommentRes {
  commentInfo: CommentInfo;
}

/**
 * 댓글 가져오기
 * @param payload 요청 본문에 포함할 데이터 (commentId)
 * @returns API 응답 결과
 */
export const sendGetComment = async (
  payload: GetCommentReq,
): Promise<{
  resultCode: number;
  resultMessage: string;
  data: CommentInfo | null;
}> => {
  try {
    const response = await api.post('/Common/getComment', payload);
    const {resultCode, resultMessage, data} = response.data;

    return {
      resultCode,
      resultMessage,
      data: data || null, // 데이터가 없으면 null 반환
    };
  } catch (error) {
    console.error('Failed to fetch comment:', error);
    return {
      resultCode: -1,
      resultMessage: 'Failed to fetch comment',
      data: null,
    };
  }
};
