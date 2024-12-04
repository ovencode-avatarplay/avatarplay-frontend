// src/app/Network/CharacterNetwork.tsx

import api, {ResponseAPI} from './ApiInstance';
import {CharacterInfo} from '@/redux-store/slices/EpisodeInfo';
// GetCharacterList

export interface GetCharacterListRes {
  characterInfoList: CharacterInfo[];
}

export const sendGetCharacterList = async (payload: {}): Promise<ResponseAPI<GetCharacterListRes>> => {
  try {
    const response = await api.post<ResponseAPI<GetCharacterListRes>>('Character/getCharacterList', payload);

    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      throw new Error(`GetCharacterListRes Error : ${response.data.resultCode}`);
    }
  } catch (error) {
    console.error('Error sending get character list :', error);
    throw new Error('Failed to send get character list data. Please try again.');
  }
};

// Create Character

export interface CreateCharacterReq {
  characterInfo: CharacterInfo;
  debugParameter: string;
}

export interface CreateCharacterRes {
  characterInfo: CharacterInfo;
}

export const sendCreateCharacter = async (payload: CreateCharacterReq): Promise<ResponseAPI<CreateCharacterRes>> => {
  try {
    const response = await api.post<ResponseAPI<CreateCharacterRes>>('Character/create', payload);

    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      throw new Error(`CreateCharacterRes Error : ${response.data.resultCode}`);
    }
  } catch (error) {
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
    const response = await api.post<ResponseAPI<DeleteCharacterRes>>('Character/delete', payload);

    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      throw new Error(`DeleteCharacterRes Error : ${response.data.resultCode}`);
    }
  } catch (error) {
    console.error('Error sending delete character :', error);
    throw new Error('Failed to send delete character. Please try again.');
  }
};

// Get CharacterData by Id

export interface GetCharacterInfoReq {
  characterId: number;
}

export interface GetCharacterInfoRes {
  characterInfo: CharacterInfo;
}

export const sendGetCharacterInfo = async (payload: GetCharacterInfoReq): Promise<ResponseAPI<GetCharacterInfoRes>> => {
  try {
    const response = await api.post<ResponseAPI<GetCharacterInfoRes>>('Character/get', payload);

    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      throw new Error(`GetChracterRes Error : ${response.data.resultCode}`);
    }
  } catch (error) {
    console.error('Error sending get character : ', error);
    throw new Error('Failed to send get character. Please try again');
  }
};

// UpdateGallery

export interface SaveGalleryReq {
  characterId: number;
  galleryType: number;
  galleryImageUrls: string[];
  debugParameter: string;
}

export interface SaveGalleryRes {}

export const sendSaveGallery = async (payload: SaveGalleryReq): Promise<ResponseAPI<SaveGalleryRes>> => {
  try {
    const response = await api.post<ResponseAPI<SaveGalleryRes>>('Character/saveGallery', payload);

    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      throw new Error(`SaveGallery Error : ${response.data.resultCode}`);
    }
  } catch (error) {
    console.error('Error save gallery :', error);
    throw new Error('Failed to send save gallery. Please try again');
  }
};

// DeleteGallery

export interface DeleteGalleryReq {
  galleryImageId: number;
}

export interface DeleteGalleryRes {}

export const sendDeleteGallery = async (payload: DeleteGalleryReq): Promise<ResponseAPI<DeleteGalleryRes>> => {
  try {
    const response = await api.post<ResponseAPI<DeleteGalleryRes>>('Character/deleteGallery', payload);

    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      throw new Error(`DeleteGallery Error : ${response.data.resultCode}`);
    }
  } catch (error) {
    console.error('Error delete gallery :', error);
    throw new Error('Failed to send delete gallery. Please try again');
  }
};

// Select Image
