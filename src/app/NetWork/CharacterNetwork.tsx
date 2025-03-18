// src/app/Network/CharacterNetwork.tsx

import {LanguageType, LLMModel} from '@/app/NetWork/network-interface/CommonEnums';
import api, {ResponseAPI} from './ApiInstance';
import {CharacterInfo, ConversationInfo} from '@/redux-store/slices/StoryInfo';
import {VisibilityType} from './ContentNetwork';
import {ProfileSimpleInfo} from './ProfileNetwork';

export interface CharacterMediaInfo {
  id: number;
  imageUrl: string;
  activationCondition: string;
  isSpoiler: boolean;
}

export enum GenderType {
  Female = 0,
  Male = 1,
  None = 2,
}

export enum CharacterIP {
  None = 0,
  Original = 1,
  Fan = 2,
}

export enum CharacterState {
  None = 0,
  Create = 1,
  Delete = 2,
}

export interface GalleryImageInfo {
  galleryImageId: number;
  isGenerate: boolean;
  debugParameter: string;
  imageUrl: string;
}

// GetCharacterList

export interface GetCharacterListReq {
  languageType: string;
}
export interface GetCharacterListRes {
  characterInfoList: CharacterInfo[];
}

export const sendGetCharacterList = async (payload: GetCharacterListReq): Promise<ResponseAPI<GetCharacterListRes>> => {
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
  languageType: string;
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

// Create Character2

export interface CreateCharacter2Req {
  languageType: string;
  payload: CharacterProfilePayload;
  debugParameter: string;
}

export interface CharacterProfilePayload {
  id: number;
  referenceLanguage: LanguageType;
  name: string;
  introduction: string;
  description: string;
  worldScenario: string;
  secret: string;
  mainImageUrl: string;
  mediaTemplateList: CharacterMediaInfo[];
  conversationTemplateList: ConversationInfo[];
  visibilityType: VisibilityType;
  llmModel: LLMModel;
  customApi: string;
  tag: string;
  positionCountryList: LanguageType[];
  characterIP: CharacterIP;
  connectCharacterId: number;
  operatorProfileIdList: ProfileSimpleInfo[];
  isMonetization: boolean;
  nsfw: boolean;
  selectLorebookId: number;
  selectPromptId: number;
  creatorComment: string;
}

export interface CreateCharacter2Res {
  characterInfo: CharacterInfo;
}

export const sendCreateCharacter2 = async (payload: CreateCharacter2Req): Promise<ResponseAPI<CreateCharacter2Res>> => {
  try {
    const response = await api.post<ResponseAPI<CreateCharacter2Res>>('Character/create', payload);

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
    } else if (response.data.resultCode === 1) {
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
  languageType: string;
  profileId?: number;
  characterId?: number;
}

export interface GetCharacterInfoRes {
  characterInfo: CharacterInfo;
  urlLinkKey: string;
}

export const sendGetCharacterProfileInfo = async (
  payload: GetCharacterInfoReq,
): Promise<ResponseAPI<GetCharacterInfoRes>> => {
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

export interface SelectImageReq {
  characterImageId: number;
}

export interface SelectImageRes {}

export const sendSelectImage = async (paylod: SelectImageReq): Promise<ResponseAPI<SelectImageRes>> => {
  try {
    const response = await api.post<ResponseAPI<SelectImageRes>>('Character/selectImage', paylod);

    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      throw new Error(`SelectImage Error : ${response.data.resultCode}`);
    }
  } catch (error) {
    console.error(`Error select image : `, error);
    throw new Error(`Failed to send select image. please try again`);
  }
};
