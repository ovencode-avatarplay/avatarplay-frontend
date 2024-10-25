// src/app/Network/CharacterNetwork.tsx

import api, {ResponseAPI} from './ApiInstance';

// Type Definitions
interface CharacterInfo {
  id: number;
  name: string;
}

//==== Set 캐릭터 정보 =======================================================================================================

// 캐릭터 설정 - Req
export interface PayloadCharacterData {
  userId: number;
  characterName: string;
  characterDescription: string;
  worldScenario: string;
  introduction: string;
  secret: string;
  thumbnail: string;
}

// 캐릭터 설정 - Rec
export interface SetCharacterRes {
  characterID: number;
}
// 캐릭터 데이터를 전송하는 새로운 POST 요청 함수 정의
export const sendCharacterData = async (payload: PayloadCharacterData): Promise<ResponseAPI<SetCharacterRes>> => {
  try {
    const response = await api.post<ResponseAPI<SetCharacterRes>>('DemoChat/setCharacter', payload); // '/character' 엔드포인트로 POST 요청 전송

    if (response.data.resultCode === 0) {
      //console.log('제출 결과 성공');

      return response.data; // 성공적으로 응답을 받은 경우
    } else {
      throw new Error('CharacterDataResponse' + response.data.resultCode); // 실패 메시지 처리
    }
  } catch (error: any) {
    console.error('Error sending character data:', error);
    throw new Error('Failed to send character data. Please try again.'); // 에러 처리
  }
};

//==== Modify 캐릭터 정보 =======================================================================================================

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

// 캐릭터 설정 - Req
export interface UpdateCharacterRes {
  characterID: number;
  characterName: string;
  characterDescription: string;
  worldScenario: string;
  introduction: string;
  secret: string;
  thumbnail: string;
}

// 캐릭터 데이터를 전송하는 새로운 POST 요청 함수 정의
export const updateCharacterData = async (payload: UpdateCharacterReq): Promise<ResponseAPI<UpdateCharacterRes>> => {
  try {
    console.error('update sending character data:', payload);
    const response = await api.post<ResponseAPI<UpdateCharacterRes>>('DemoChat/updateCharacter', payload); // '/character' 엔드포인트로 POST 요청 전송

    if (response.data.resultCode === 0) {
      //console.log('제출 결과 성공');

      return response.data; // 성공적으로 응답을 받은 경우
    } else {
      throw new Error('UpdateCharacterRes' + response.data.resultCode); // 실패 메시지 처리
    }
  } catch (error: any) {
    console.error('Error sending character data:', error);
    throw new Error('Failed to send character data. Please try again.'); // 에러 처리
  }
};

//==== Delete 캐릭터 정보 =======================================================================================================

export interface DeleteCharacterReq {
  characterID: number;
}

export interface DeleteCharacterRes {
  characterInfoList: CharacterInfo[];
}

// 캐릭터 데이터를 전송하는 새로운 POST 요청 함수 정의
export const deleteCharacterData = async (payload: DeleteCharacterReq): Promise<ResponseAPI<UpdateCharacterRes>> => {
  try {
    //console.log('캐릭터 삭제 요청2');
    const response = await api.post<ResponseAPI<UpdateCharacterRes>>('DemoChat/deleteCharacter', payload); // '/character' 엔드포인트로 POST 요청 전송

    if (response.data.resultCode === 0) {
      //console.log('제출 결과 성공');

      return response.data; // 성공적으로 응답을 받은 경우
    } else {
      throw new Error('deleteCharacterRes' + response.data.resultCode); // 실패 메시지 처리
    }
  } catch (error: any) {
    console.error('Error sending character data:', error);
    throw new Error('Failed to send character data. Please try again.'); // 에러 처리
  }
};

//==== Get 캐릭터 리스트 정보 =======================================================================================================

// Type Definitions
interface CharacterInfo {
  id: number;
  name: string;
}

interface ResponseCharactersInfo {
  characterInfoList: CharacterInfo[];
}

// Fetch Character Info Function
export const fetchCharacterInfo = async (): Promise<{
  resultCode: number;
  resultMessage: string;
  data: {
    characterInfoList: CharacterInfo[];
  } | null;
}> => {
  try {
    //console.log('요청합니다 시작');

    // POST 요청을 보내기 위한 기본적인 payload 정의
    const payload = {}; // 필요한 경우 이곳에 payload를 정의

    const response = await api.post<ResponseAPI<ResponseCharactersInfo>>('DemoChat/getCharacters', payload); // POST 요청

    const {resultCode, resultMessage, data} = response.data;

    if (resultCode === 0) {
      //console.log('성공적으로 데이터 가져옴:', data.characterInfoList);

      return {resultCode, resultMessage, data};
    } else {
      console.error(`Error: ${resultMessage}`);

      return {resultCode, resultMessage, data: null};
    }
  } catch (error: any) {
    console.error('Failed to fetch character info:', error);

    return {resultCode: -1, resultMessage: 'Failed to fetch character info', data: null};
  }
};

//==== Get 캐릭터 상세 정보 =======================================================================================================

interface ReqCharacterInfoDetail {
  characterID: number;
}

interface CharacterDataDetail {
  secrets: string;
  char_name: string;
  first_mes: string;
  char_persona: string;
  world_scenario: string;
}

interface ResponseCharacterInfoDetail {
  resultCode: number;
  resultMessage: string;
  data: {
    characterID: number;
    characterData: CharacterDataDetail;
  };
  thumbnail: string;
}

export const sendCharacterInfoDetail = async (
  charaterID: number,
): Promise<{
  resultCode: number;
  resultMessage: string;
  data: {
    characterID: number;
    characterData: CharacterDataDetail;
  } | null;
  thumbnail: string;
}> => {
  try {
    //console.log('요청합니다 시작');
    const ReqData: ReqCharacterInfoDetail = {characterID: charaterID};

    // POST 요청을 보내기 위한 기본적인 payload 정의
    //const payload = {}; // 필요한 경우 이곳에 payload를 정의

    //console.log('reqdata ',ReqData)
    const response = await api.post<ResponseCharacterInfoDetail>('DemoChat/getCharacter', ReqData); // POST 요청

    const {resultCode, resultMessage, data, thumbnail} = response.data;

    if (resultCode === 0) {
      //console.log('성공적으로 캐릭터 상세 데이터 가져옴:', data );

      return {resultCode, resultMessage, data, thumbnail};
    } else {
      console.error(`Error: ${resultMessage}`);

      return {resultCode, resultMessage, data: null, thumbnail};
    }
  } catch (error: any) {
    console.error('Failed to fetch character info:', error);

    return {resultCode: -1, resultMessage: 'Failed to fetch character info', data: null, thumbnail: ''};
  }
};
