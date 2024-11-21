// src/app/Network/CharacterNetwork.tsx

import api, {ResponseAPI} from './ApiInstance';
import {CharacterInfo} from '@/redux-store/slices/EpisodeInfo';

// GetCharacterList

export interface GetCharacterListRes {
  characterInfoList: CharacterInfo[];
}

export const sendGetCharacterList = async (): Promise<ResponseAPI<GetCharacterListRes>> => {
  try {
    const response = await api.post<ResponseAPI<GetCharacterListRes>>('Character/getCharacterList');

    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      throw new Error(`GetCharacterListRes Error : ${response.data.resultCode}`);
    }
  } catch (error: any) {
    console.error('Error sending get character list :', error);
    throw new Error('Failed to send get character list data. Please try again.');
  }
};

// Create Character

export interface CreateCharacterReq {
  characterInfo: CharacterInfo;
}

export interface CreateCharacterRes {
  characterInfo: CharacterInfo;
}

export const sendCreateCharacter = async (payload: CreateCharacterReq): Promise<ResponseAPI<CreateCharacterRes>> => {
  try {
    const response = await api.post<ResponseAPI<CreateCharacterRes>>('Character/create');

    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      throw new Error(`CreateCharacterRes Error : ${response.data.resultCode}`);
    }
  } catch (error: any) {
    console.error('Error sending create character :', error);
    throw new Error('Failed to send create character. Please try again.');
  }
};

// Delete Character

export interface DeleteCharacterReq {
  characterId: number;
}

export interface DeleteCharacterRes {}

export const sendDeleteCharacter = async (payload: DeleteCharacterReq): Promise<ResponseAPI<DeleteCharacterRes>> => {
  try {
    const response = await api.post<ResponseAPI<DeleteCharacterRes>>('Character/delete');

    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      throw new Error(`DeleteCharacterRes Error : ${response.data.resultCode}`);
    }
  } catch (error: any) {
    console.error('Error sending delete character :', error);
    throw new Error('Failed to send delete character. Please try again.');
  }
};

// Select Image
