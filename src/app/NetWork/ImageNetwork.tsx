// src/app/Network/ImageNetwork.ts

import {string} from 'valibot';
import api, {ResponseAPI} from './ApiInstance';
// MediaState Enum 정의 (숫자 값으로 설정)
import axios from 'axios';

export enum MediaState {
  None = 0,
  CharacterImage = 1,
  BackgroundImage = 2,
  ContentImage = 3,
  TtsVoice = 4,
  TriggerImage = 5,
  TriggerVideo = 6,
  TriggerAudio = 7,
}

export interface Upload {
  mediaState: MediaState; // MediaState를 enum으로 사용
  file: File;
}

export interface UploadResponseData {
  url: string;
  imageUrlList: string[];
}

export const sendUploadImage = async (payload: Upload): Promise<ResponseAPI<UploadResponseData>> => {
  try {
    // FormData를 사용하여 파일 및 mediaState를 전송
    const formData = new FormData();
    formData.append('MediaState', payload.mediaState.toString()); // MediaState를 숫자로 변환하여 폼 데이터에 추가
    formData.append('File', payload.file); // 파일 추가

    const response = await axios.post<ResponseAPI<UploadResponseData>>('/api/v1/Resource/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // multipart 형식 지정
      },
    });

    if (response.data.resultCode === 0) {
      // 성공 시 결과 반환
      return response.data;
    } else {
      throw new Error(`UploadImage Error: ${response.data.resultMessage}`);
    }
  } catch (error: any) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image. Please try again.');
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
