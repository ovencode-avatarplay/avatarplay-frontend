import api, {ResponseAPI} from './ApiInstance';
import {getBrowserLanguage} from '@/utils/getLocalizedText';
import {getLangUrlCode} from '@/configs/i18n';

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

//##########    sign - 접속시 서버에 나의 브라우저 언어상태를 준다.
export interface SignInReq {
  language: string;
}

export interface SignInRes {
  language: string;
}

export const sendSignIn = async (payload: SignInReq): Promise<boolean> => {
  try {
    const jwtToken = localStorage.getItem('jwt');
    const _language = getLangUrlCode(getBrowserLanguage());
    const response = await fetch(`${process.env.NEXT_PUBLIC_CHAT_API_URL}/api/v1/auth/sign-in`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwtToken}`, // JWT를 Authorization 헤더에 포함
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: _language,
      }),
    });

    if (!response.ok) {
      console.error('Failed to authenticate:', response.statusText);
      return false;
    }

    const data = await response.json();
    localStorage.setItem('jwt', data.accessToken);
    //fetchLanguage(router);
    return true;
  } catch (error) {
    console.error('Error occurred during authentication:', error);
    return false;
  }
};
//##########    sign-in 끝

export interface GetLanguageReq {}

export interface GetLanguageRes {
  languageType: LanguageType;
}

export const sendGetLanguage = async (payload: GetLanguageReq): Promise<ResponseAPI<GetLanguageRes>> => {
  try {
    const response = await api.post<ResponseAPI<GetLanguageRes>>('Auth/getLanguage', payload);

    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      throw new Error(`GetLanguage Error : ${response.data.resultCode}`);
    }
  } catch (error) {
    console.error('Error get language :', error);
    throw new Error('Failed to send get language. Please try again');
  }
};

export interface ChangeLanguageReq {
  languageType: LanguageType;
}

export interface ChangeLanguageRes {
  languageType: LanguageType;
}

export const changeLanguage = async (payload: ChangeLanguageReq): Promise<ResponseAPI<ChangeLanguageRes>> => {
  try {
    const response = await api.post<ResponseAPI<ChangeLanguageRes>>('Auth/changeLanguage', payload);

    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      throw new Error(`ChangeLanguage Error : ${response.data.resultCode}`);
    }
  } catch (error) {
    console.error('Error change language : ', error);
    throw new Error('Failed to send change language. Please try again');
  }
};
