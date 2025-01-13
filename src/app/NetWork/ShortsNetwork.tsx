// src/app/Network/ShortsNetwork.ts

import api from './ApiInstance';

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

// 추천 피드 API 응답 타입 정의
interface ResponseRecommendFeed {
  resultCode: number;
  resultMessage: string;
  data: {
    feedInfoList: FeedInfo[];
  } | null;
}

/**
 * 추천 피드 가져오기
 * @returns API 응답 결과
 */
export const sendGetRecommendFeed = async (): Promise<{
  resultCode: number;
  resultMessage: string;
  data: FeedInfo[] | null;
}> => {
  try {
    // GET 요청 전송
    const response = await api.get<ResponseRecommendFeed>('/Feed/recommend');

    const {resultCode, resultMessage, data} = response.data;

    if (resultCode === 0) {
      return {resultCode, resultMessage, data: data?.feedInfoList || null};
    } else {
      console.error(`Error: ${resultMessage}`);
      return {resultCode, resultMessage, data: null};
    }
  } catch (error) {
    console.error('Failed to fetch recommended feeds:', error);
    return {
      resultCode: -1,
      resultMessage: 'Failed to fetch recommended feeds',
      data: null,
    };
  }
};

// GET Feed API 호출 함수
export const sendGetFeed = async (
  feedId: number,
): Promise<{resultCode: number; resultMessage: string; data: FeedInfo | null}> => {
  try {
    const response = await api.post('/Feed/get', {feedId});
    const {resultCode, resultMessage, data} = response.data;

    if (resultCode === 0) {
      return {resultCode, resultMessage, data: data?.feedInfo || null};
    } else {
      console.error(`Error: ${resultMessage}`);
      return {resultCode, resultMessage, data: null};
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
): Promise<{resultCode: number; resultMessage: string}> => {
  try {
    const response = await api.post('/Feed/like', {feedId, isLike});
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

// Comment 추가 API 호출 함수
export const sendAddComment = async (
  feedId: number,
  parentCommentId: number,
  content: string,
): Promise<{
  resultCode: number;
  resultMessage: string;
  data: {
    feedId: number;
    parentCommentId: number;
    userName: string;
    content: string;
    createAt: string;
  } | null;
}> => {
  try {
    const response = await api.post('/api/v1/Feed/addComment', {
      feedId,
      parentCommentId,
      content,
    });

    const {resultCode, resultMessage, data} = response.data;

    if (resultCode === 0) {
      return {resultCode, resultMessage, data};
    } else {
      console.error(`Error: ${resultMessage}`);
      return {resultCode, resultMessage, data: null};
    }
  } catch (error) {
    console.error('Failed to add comment:', error);
    return {
      resultCode: -1,
      resultMessage: 'Failed to add comment',
      data: null,
    };
  }
};

// Comment 수정 API 호출 함수
export const sendUpdateComment = async (
  commentId: number,
  content: string,
): Promise<{
  resultCode: number;
  resultMessage: string;
  data: {
    commentInfo: {
      commentId: number;
      content: string;
      parentCommentId: number;
      userName: string;
      likeCount: number;
      isLike: boolean;
      isDisLike: boolean;
      isModify: boolean;
      updatedAt: string;
    };
  } | null;
}> => {
  try {
    const response = await api.post('/api/v1/Feed/updateComment', {
      commentId,
      content,
    });

    const {resultCode, resultMessage, data} = response.data;

    if (resultCode === 0) {
      return {resultCode, resultMessage, data};
    } else {
      console.error(`Error: ${resultMessage}`);
      return {resultCode, resultMessage, data: null};
    }
  } catch (error) {
    console.error('Failed to update comment:', error);
    return {
      resultCode: -1,
      resultMessage: 'Failed to update comment',
      data: null,
    };
  }
};

// Comment Like API 호출 함수
export const sendCommentLike = async (
  commentId: number,
  isLike: boolean,
): Promise<{
  resultCode: number;
  resultMessage: string;
  data: {
    commentId: number;
    isLike: boolean;
    likeCount: number;
  } | null;
}> => {
  try {
    const response = await api.post('/api/v1/Feed/commentLike', {
      commentId,
      isLike,
    });

    const {resultCode, resultMessage, data} = response.data;

    if (resultCode === 0) {
      return {resultCode, resultMessage, data};
    } else {
      console.error(`Error: ${resultMessage}`);
      return {resultCode, resultMessage, data: null};
    }
  } catch (error) {
    console.error('Failed to like comment:', error);
    return {
      resultCode: -1,
      resultMessage: 'Failed to like comment',
      data: null,
    };
  }
};

// Comment Dislike API 호출 함수
export const sendCommentDislike = async (
  commentId: number,
  isDisLike: boolean,
): Promise<{
  resultCode: number;
  resultMessage: string;
  data: {
    commentId: number;
    isDisLike: boolean;
  } | null;
}> => {
  try {
    const response = await api.post('/api/v1/Feed/commentDislike', {
      commentId,
      isDisLike,
    });

    const {resultCode, resultMessage, data} = response.data;

    if (resultCode === 0) {
      return {resultCode, resultMessage, data};
    } else {
      console.error(`Error: ${resultMessage}`);
      return {resultCode, resultMessage, data: null};
    }
  } catch (error) {
    console.error('Failed to dislike comment:', error);
    return {
      resultCode: -1,
      resultMessage: 'Failed to dislike comment',
      data: null,
    };
  }
};
