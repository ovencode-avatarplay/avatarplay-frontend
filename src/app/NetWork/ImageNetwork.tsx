// src/app/Network/ImageNetwork.ts

import api, {ResponseAPI} from './ApiInstance';
export enum MediaState {
  None = 0,
  CharacterImage = 1,
  GalleryImage = 2,
  BackgroundImage = 3,
  ContentImage = 4,
  TtsVoice = 5,
  TriggerImage = 6,
  TriggerVideo = 7,
  TriggerAudio = 8,
}

export interface MediaUploadReq {
  mediaState: number; // Enum 타입
  file?: File; // 업로드할 파일
  triggerImageList?: File[]; // 추가 이미지 파일 리스트 (선택적)
}

export interface MediaUploadRes {
  url: string; // 메인 URL
  imageUrlList: string[]; // 추가 이미지 URL 리스트
}
export const sendUpload = async (payload: MediaUploadReq): Promise<ResponseAPI<MediaUploadRes>> => {
  try {
    const formData = new FormData();

    formData.append('MediaState', payload.mediaState.toString()); // Enum 값 추가

    if (payload.file) {
      formData.append('File', payload.file);
    } else {
      // ImageList가 비어있을 때 빈 필드라도 전송
      formData.append('File', new Blob()); // 빈 Blob을 추가
    }
    // 메인 파일 추가

    // 추가 이미지 리스트 처리s
    if (Array.isArray(payload.triggerImageList) && payload.triggerImageList.length > 0) {
      payload.triggerImageList.forEach(file => {
        formData.append('TriggerImageList', file); // 서버가 List<IFormFile>로 수신
      });
    } else {
      // ImageList가 비어있을 때 빈 필드라도 전송
      formData.append('TriggerImageList', new Blob([])); // 빈 Blob을 추가
    }

    // Axios 요청
    const response = await api.post<ResponseAPI<MediaUploadRes>>('Resource/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // FormData 요청 설정
      },
    });

    // 성공 시 응답 반환
    return response.data;
  } catch (error: any) {
    console.error('Error uploading media:', error);
    throw new Error('Failed to upload media.');
  }
};

export interface GenerateParameter {
  name: string;
  value: number;
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
