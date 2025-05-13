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
export enum InteractionType {
  Story = 0,
  Feed = 1,
  Contents = 2,
  Character = 3,
  Channel = 4,
  Episode = 5,
  Friend = 6,
}
// Feed Like API 호출 함수
export const sendLike = async (
  interactionType: InteractionType,
  typeValueId: number,
  isLike: boolean,
): Promise<{
  resultCode: number;
  resultMessage: string;
  data: {feedId: number; isLike: boolean; likeCount: number} | null;
}> => {
  try {
    const response = await api.post('/Common/like', {interactionType, typeValueId, isLike});
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
    console.error('Failed to like :', error);
    return {
      resultCode: -1,
      resultMessage: 'Failed to like ',
      data: null,
    };
  }
};

// Feed Like API 호출 함수
export const sendDisLike = async (
  interactionType: InteractionType,
  typeValueId: number,
  isDisLike: boolean,
): Promise<{resultCode: number; resultMessage: string}> => {
  try {
    const response = await api.post('/Common/dislike', {interactionType, typeValueId, isDisLike});
    const {resultCode, resultMessage} = response.data;

    if (resultCode === 0) {
      return {resultCode, resultMessage};
    } else {
      console.error(`Error: ${resultMessage}`);
      return {resultCode, resultMessage};
    }
  } catch (error) {
    console.error('Failed to like :', error);
    return {
      resultCode: -1,
      resultMessage: 'Failed to like ',
    };
  }
};

export interface BookMarkReq {
  interactionType: InteractionType;
  typeValueId: number;
  isBookMark: boolean;
}

export interface BookMarkRes {
  isBookMark: boolean;
}

export const bookmark = async (payload: BookMarkReq) => {
  try {
    const res = await api.post<ResponseAPI<BookMarkRes>>('Common/bookmark', payload);

    if (res.status !== 200) {
      console.error('bookmark API 응답 오류:', res);
      return null;
    }

    return res.data;
  } catch (e) {
    console.error('bookmark API 요청 실패:', e);
    return null;
  }
};

export enum RecordType {
  Feed = 1,
  Character = 2,
  Content = 3,
  Episode = 4,
  Channel = 5,
}

export interface DeleteRecordReq {
  recordType: RecordType;
  typeValueId: number;
}

export interface DeleteRecordRes {}

export const deleteRecord = async (payload: DeleteRecordReq) => {
  try {
    const res = await api.post<ResponseAPI<DeleteRecordRes>>('Common/deleteRecord', payload);

    if (res.status !== 200) {
      console.error('deleteRecord API 응답 오류:', res);
      return null;
    }

    return res.data;
  } catch (e) {
    console.error('deleteRecord API 요청 실패:', e);
    return null;
  }
};

export interface DeleteCommentReq {
  commentId: number;
}

export interface DeleteCommentRes {
  commentId: number;
  isDeleted: boolean;
}

export const sendDeleteComment = async (payload: DeleteCommentReq): Promise<ResponseAPI<DeleteCommentRes>> => {
  try {
    const response = await api.post<ResponseAPI<DeleteCommentRes>>('Common/deleteComment', payload);
    if (response.data.resultCode === 0) return response.data;
    throw new Error(`DeleteCommentRes Error: ${response.data.resultCode}`);
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw new Error('Failed to delete comment. Please try again.');
  }
};

export interface PinFixReq {
  type: PinTabType;
  typeValueId: number;
  isFix: boolean;
}

export interface PinFixRes {}

export enum PinTabType {
  None = 0,
  FavoritesFeed = 1,
  FavoritesCharacter = 2,
  FavoritesChannel = 3,
  FavoritesContents = 4,
  FavoritesEpisode = 5,
  FavoritesGame = 6,
  RecordFeed = 7,
  RecordCharacter = 8,
  RecordContents = 9,
  RecordGame = 10,
  CharacterChatMessage = 11,
  DMChatMessage = 12,
}

export const pinFix = async (payload: PinFixReq): Promise<ResponseAPI<PinFixRes>> => {
  try {
    const response = await api.post<ResponseAPI<PinFixRes>>('Common/pinfix', payload);
    if (response.data.resultCode === 0) return response.data;
    throw new Error(`pinFix Error: ${response.data.resultCode}`);
  } catch (error) {
    console.error('Error pinFix:', error);
    throw new Error('Failed to pinFix. Please try again.');
  }
};

export interface ReportReq {
  interactionType: number; // 예: 댓글, 피드, 에피소드 등
  typeValueId: number; // 신고 대상 ID
  isReport: boolean; // true: 신고, false: 신고 취소
}

export interface ReportRes {
  isReport: boolean;
}
export const sendReport = async (payload: ReportReq): Promise<ResponseAPI<ReportRes>> => {
  try {
    const response = await api.post<ResponseAPI<ReportRes>>('/Common/report', payload);
    if (response.data.resultCode === 0) return response.data;
    throw new Error(`ReportRes Error: ${response.data.resultCode}`);
  } catch (error) {
    console.error('Error reporting content:', error);
    throw new Error('Failed to report. Please try again.');
  }
};
