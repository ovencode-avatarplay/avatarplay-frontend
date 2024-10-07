// src/app/Network/CharacterNetwork.ts
import { AxiosInstance } from 'axios';
import api from './apiInstance';

// 캐릭터 정보 타입
export interface PayloadCharacterData {
  userId: number;
  characterName: string;
  characterDescription: string;
  worldScenario: string;
  introduction: string;
  secret: string;
  thumbnail: string;
}

export interface SetCharacterRes {
  characterID: number;
}

// 캐릭터 설정
export const sendCharacterData = async (payload: PayloadCharacterData) => {
  try {
    const response = await api.post(`/DemoChat/setCharacter`, payload);
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to send character data');
  }
};

// 캐릭터 수정
export interface UpdateCharacterReq {
  userID: number;
  characterID: number;
  characterName: string;
  characterDescription: string;
  worldScenario: string;
  introduction: string;
  secret: string;
  thumbnail: string;
}

export const updateCharacterData = async (payload: UpdateCharacterReq) => {
  try {
    const response = await api.post(`/DemoChat/updateCharacter`, payload);
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to update character data');
  }
};

// 캐릭터 삭제
export interface DeleteCharacterReq {
  characterID: number;
}

export const deleteCharacterData = async (payload: DeleteCharacterReq) => {
  try {
    const response = await api.post(`/DemoChat/deleteCharacter`, payload);
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to delete character');
  }
};

// 캐릭터 리스트 조회
export const fetchCharacterInfo = async () => {
  try {
    const response = await api.post(`/DemoChat/getCharacters`);
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to fetch characters');
  }
};
