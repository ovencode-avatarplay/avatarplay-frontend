// src/app/Network/ImageNetwork.ts

import {string} from 'valibot';
import api, {ResponseAPI} from './ApiInstance';

export interface UploadImageReq {
  file: File;
}

export const sendUploadImage = async (payload: UploadImageReq): Promise<ResponseAPI<string>> => {
  try {
    const response = await api.post<ResponseAPI<string>>('Resource/uploadImage', payload, {
      headers: {
        'Content-Type': 'multipart/form-data', // multipart 형식 지정
      },
    });

    if (response.data.resultCode === 0) {
      // console.log('이미지 업로드 성공');
      return response.data;
    } else {
      throw new Error(`UploadImage Error: ${response.data.resultCode}`);
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
