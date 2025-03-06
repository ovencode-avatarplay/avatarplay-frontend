// src/app/Network/CharacterNetwork.tsx

import api, {ResponseAPI} from './ApiInstance';
import {CharacterInfo, GalleryImageInfo} from '@/redux-store/slices/StoryInfo';
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

export enum LanguageType {
  Korean = 0,
  English = 1,
  Japanese = 2,
  French = 3,
  Spanish = 4,
  ChineseSimplified = 5,
  ChineseTraditional = 6,
  Portuguese = 7,
  German = 8,
}

export enum LLMModel {
  GPT_4o = 0,
  GPT_4 = 1,
  GPT_3_5 = 2,
  Claude_V2 = 3,
  Claude_3_Opus = 4,
  Claude_3_Sonnet = 5,
  Claude_3_5_Sonnet = 6,
  Claude_3_5_Sonnet_V2 = 7,
  Claude_3_Haiku = 8,
}
export interface CharacterMediaInfo {
  id: number;
  imageUrl: string;
  activationCondition: string;
  isSpoiler: boolean;
}

export interface ConversationInfo {
  id: number;
  conversationType: ConversationType;
  user: string;
  character: string;
}

export enum ConversationType {
  Important,
  AlwaysImportant,
}

export enum VisibilityType {
  Private = 0,
  Unlisted = 1,
  Public = 2,
  Create = 3,
}

export enum CharacterIP {
  Original,
  Fan,
}

export enum ProfileTabType {
  My = 0,
  Shared = 1,
}

export enum OperatorAuthorityType {
  None = 0,
  Owner = 1,
  CanEdit = 2,
  OnlyComments = 3,
}

export enum ProfileType {
  User = 0,
  PD = 1,
  Character = 2,
  Channel = 3,
}

export interface ProfileSimpleInfo {
  profileId: number;
  profileTabType: ProfileTabType;
  operatorAuthorityType: OperatorAuthorityType;
  profileType: ProfileType;
  name: string;
  description?: string;
  iconImageUrl: string;
  nsfw: boolean;
}

export enum Subscription {
  IP,
  Contents,
}

export enum PaymentType {
  USA,
  Korea,
}

export interface MembershipSetting {
  subscription: Subscription;
  paymentType: PaymentType;
  paymentAmount: number;
  benefits: string;
}

export interface PromptInfo {
  id: number;
  name: string;
}

export interface LorebookInfo {
  id: number;
  name: string;
}

export interface CustomModulesInfo {
  promptInfoList: PromptInfo[];
  selectPromptIndex: number;
  lorebookInfoList: LorebookInfo[];
  selectLorebookIndex: number;
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
  characterId: number;
}

export interface GetCharacterInfoRes {
  characterInfo: CharacterInfo;
  urlLinkKey: string;
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
