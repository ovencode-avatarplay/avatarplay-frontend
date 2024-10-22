// src/app/Network/ImageNetwork.ts

import {string} from 'valibot';
import api, {ResponseAPI} from './ApiInstance';

export interface UploadImageReq {
  file: File;
}

export const sendUploadImage = async (payload: UploadImageReq): Promise<ResponseAPI<string>> => {
  try {
    const response = await api.post<ResponseAPI<string>>('Chat/uploadImage', payload, {
      headers: {
        'Content-Type': 'multipart/form-data', // multipart 형식 지정
      },
    });

    if (response.data.resultCode === 0) {
      console.log('이미지 업로드 성공');
      return response.data;
    } else {
      throw new Error(`UploadImage Error: ${response.data.resultCode}`);
    }
  } catch (error: any) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image. Please try again.');
  }
};
