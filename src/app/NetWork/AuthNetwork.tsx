import api, {ResponseAPI} from './ApiInstance';

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
