// src/app/Network/ImageNetwork.ts

import api, {ResponseAPI} from './ApiInstance';
export enum UploadMediaState {
  // None
  None = 0,
  // 캐릭터 이미지
  CharacterImage = 1,
  // 갤러리 이미지
  GalleryImage = 2,
  // 배경 이미지
  BackgroundImage = 3,
  // 스토리 이미지
  StoryImage = 4,
  // TTS 보이스
  TtsVoice = 5,
  // 트리거 이미지
  TriggerImage = 6,
  // 트리거 영상
  TriggerVideo = 7,
  // 트리거 음성
  TriggerAudio = 8,
  // 피드 영상
  FeedVideo = 9,
  // 피드 이미지
  FeedImage = 10,
  // 압축 피드 영상
  CompressFeedVideo = 11,
  // 압축 피드 이미지
  CompressFeedImage = 12,
  // 컨텐츠 에피소드 영상
  ContentEpisodeVideo = 13,
  // 컨텐츠 에피소드 자막
  ContentEpisodeSubtitle = 14,
  // 컨텐츠 에피소드 더빙
  ContentEpisodeDubbing = 15,
  // 컨텐츠 에피소드 웹툰 이미지
  ContentEpisodeWebtoonImage = 16,
  // 컨텐츠 에피소드 웹툰 자막 이미지
  ContentEpisodeWebtoonSubtitle = 17,
  // 컨텐츠 이미지
  ContentImage = 18,
  // 컨텐츠 영상
  ContentVideo = 19,
  // DM 채팅 이미지
  DmChatImage = 20,
  // DM 채팅 영상
  DmChatVideo = 21,
  // DM 채팅 오디오
  DmChatAudio = 22,
  // 워크룸 이미지 업로드
  WorkroomItemImageType = 23,
  // 워크룸 비디오 업로드
  WorkroomItemVideoType = 24,
  // 워크룸 오디오 업로드
  WorkroomItemAudioType = 25,
  // 워크룸 문서 업로드
  WorkroomItemDocumentType = 26,
}

export interface MediaUploadInfo {
  fileName: string;
  url: string;
  playTime: string;
}

export interface MediaUploadReq {
  mediaState: UploadMediaState; // Enum 타입
  fileList?: File[]; // 추가 이미지 파일 리스트 (선택적)
}

export interface MediaUploadRes {
  mediaUploadInfoList: MediaUploadInfo[];
}

export const sendUpload = async (payload: MediaUploadReq): Promise<ResponseAPI<MediaUploadRes>> => {
  try {
    const formData = new FormData();

    formData.append('MediaState', payload.mediaState.toString()); // Enum 값 추가

    if (Array.isArray(payload.fileList) && payload.fileList.length > 0) {
      payload.fileList.forEach(file => {
        formData.append('fileList', file);
      });
    } else {
      formData.append('fileList', new Blob([])); // 빈 Blob 추가
    }

    const response = await api.post<ResponseAPI<MediaUploadRes>>('Resource/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      // ResultCode별 에러 처리
      switch (response.data.resultCode) {
        case 1:
          alert('Invalid: 파일 정보가 없습니다.');
          break;
        default:
          alert('Unknown Error: 예상치 못한 에러가 발생했습니다.');
      }
      throw new Error(`MediaUploadRes Error: ${response.data.resultCode}`);
    }
  } catch (error: any) {
    console.error('Error uploading media:', error);
    throw new Error('Failed to upload media.');
  }
};

export interface GenerateParameter {
  name: string;
  value: number;
  prompt: string;
}
export interface GenerateImageReq {
  values: GenerateParameter[];
}

export interface GenerateImageRes {
  debugParameter: string;
  imageUrl: string[];
}
export const sendGenerateImageReq = async (payload: GenerateImageReq): Promise<ResponseAPI<GenerateImageRes>> => {
  try {
    const response = await api.post<ResponseAPI<GenerateImageRes>>('Resource/generateImage', payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      throw new Error(`Generate Image Error: ${response.data.resultCode}`);
    }
  } catch (error: any) {
    console.error('Error generating image:', error);
    throw new Error('Failed to generate image. Please try again.');
  }
};

//프롬프트로 이미지 만들게
export interface GenerateImageReq2 {
  modelId: string;
  prompt: string;
  negativePrompt: string;
  batchSize: number;
  seed: number;
}

export interface GenerateImageRes2 {
  imageUrl: string[];
}
export const sendGenerateImageReq2 = async (payload: GenerateImageReq2): Promise<ResponseAPI<GenerateImageRes2>> => {
  try {
    const response = await api.post<ResponseAPI<GenerateImageRes2>>('Resource/generateImage2', payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      throw new Error(`Generate Image Error: ${response.data.resultCode}`);
    }
  } catch (error: any) {
    console.error('Error generating image:', error);
    throw new Error('Failed to generate image. Please try again.');
  }
};

//SinkIn으로 포즈 이미지 만들게
export interface GeneratePoseReq {
  url: string;
  pose: string;
}

export interface GeneratePoseRes {
  imageUrl: string[];
}
export const sendGeneratePoseReq = async (payload: GeneratePoseReq): Promise<ResponseAPI<GeneratePoseRes>> => {
  try {
    const response = await api.post<ResponseAPI<GeneratePoseRes>>('Resource/generatePose', payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      throw new Error(`Generate Image Error: ${response.data.resultCode}`);
    }
  } catch (error: any) {
    console.error('Error generating image:', error);
    throw new Error('Failed to generate image. Please try again.');
  }
};

//SinkIn으로 표정 이미지 만들게
export interface GenerateExpressionReq {
  url: string;
  expression: string;
}

export interface GenerateExpressionRes {
  imageUrl: string[];
}
export const sendGenerateExpressionReq = async (
  payload: GenerateExpressionReq,
): Promise<ResponseAPI<GenerateExpressionRes>> => {
  try {
    const response = await api.post<ResponseAPI<GenerateExpressionRes>>('Resource/generateExpression', payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      throw new Error(`Generate Image Error: ${response.data.resultCode}`);
    }
  } catch (error: any) {
    console.error('Error generating image:', error);
    throw new Error('Failed to generate image. Please try again.');
  }
};
export interface UploadTempFileRes {
  uploadFileName: string;
  tempFileName: string;
}

export const sendUploadTempFile = async (file?: File): Promise<ResponseAPI<UploadTempFileRes>> => {
  try {
    const formData = new FormData();

    // file이 존재하면 추가, 없으면 빈 Blob으로 대체
    if (file) {
      formData.append('UploadFile', file); // 필드명 주의
    } else {
      formData.append('UploadFile', new Blob()); // 빈 Blob 추가
    }

    const response = await api.post<ResponseAPI<UploadTempFileRes>>('Resource/uploadTempFile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // 성공
    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      // resultCode 별 alert 처리
      switch (response.data.resultCode) {
        case 1:
          alert('Invalid: 업로드할 파일이 없습니다.');
          break;
        case 2:
          alert('Invalid: 허용되지 않는 파일 형식입니다.');
          break;
        case 3:
          alert('Server Error: 서버에서 파일 저장에 실패했습니다.');
          break;
        default:
          alert('Unknown Error: 예상치 못한 에러가 발생했습니다.');
          break;
      }
      throw new Error(`UploadTempFile Error: ${response.data.resultCode}`);
    }
  } catch (error: any) {
    console.error('🚨 Temp file upload error:', error);
    throw new Error('임시 파일 업로드에 실패했습니다. 다시 시도해 주세요.');
  }
};
