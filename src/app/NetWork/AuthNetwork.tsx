import {getBrowserLanguage} from '@/utils/browserInfo';
import api, {ResponseAPI} from './ApiInstance';
import {getLangUrlCode} from '@/configs/i18n';
import {AxiosResponse} from 'axios';
import {ProfileSimpleInfo, ProfileType} from './ProfileNetwork';
import {LanguageType} from './network-interface/CommonEnums';
import {ESystemError} from './ESystemError';

//##########    sign - 접속시 서버에 나의 브라우저 언어상태를 준다.
export interface SignInReq {
  language: string;
}

export interface SignInRes {
  sessionInfo: SessionInfo;
  profileInfo: ProfileSimpleInfo;
}

export interface SessionInfo {
  name: string;
  accessToken: string;
  star: number;
  ruby: number;
}
export interface GetLanguageReq {}

export interface GetLanguageRes {
  languageType: LanguageType;
}

export const sendGetLanguage = async (payload: GetLanguageReq): Promise<ResponseAPI<GetLanguageRes> | null> => {
  try {
    const response = await api.post<ResponseAPI<GetLanguageRes>>('Auth/getLanguage', payload);

    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      throw new Error(`GetLanguage Error : ${response.data.resultCode}`);
    }
  } catch (error) {
    console.error('Error get language :', error);
    return null;
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

interface GetAuthProfileInfoRes {
  profileSimpleInfo: ProfileSimpleInfo;
}

export const getAuth = async (token: string | null = null) => {
  try {
    let jwtToken: string | null = '';
    if (token === null) {
      jwtToken = localStorage?.getItem('jwt');
    } else {
      jwtToken = token;
    }
    const _language = getLangUrlCode(getBrowserLanguage());

    const resProfileInfo = await fetch(`${process.env.NEXT_PUBLIC_CHAT_API_URL}/api/v1/Auth/getProfileInfo`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwtToken}`, // JWT를 Authorization 헤더에 포함
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    if (!resProfileInfo.ok) {
      console.error('Failed to auth:', resProfileInfo.statusText);
      console.log('Auth  리스폰스 ok 실패');
      return;
    }

    if (jwtToken) localStorage?.setItem('jwt', jwtToken);

    const data: ResponseAPI<GetAuthProfileInfoRes> = await resProfileInfo.json();
    return data;
  } catch (e) {
    //alert('api 에러' + e);
    console.log('api 에러');
  }
};

export interface CurrencyInfoReq {}
export interface GoodsInfo {
  star: number;
  ruby: number;
}
export interface CurrencyInfoRes {
  goodsInfo: GoodsInfo;
}

// // Sending Cheat Message
// export const sendCurrencyInfo = async (): Promise<ResponseAPI<CurrencyInfoRes>> => {
//   const currencyInfoReq: CurrencyInfoReq = {};
//   try {
//     const response = await api.post<ResponseAPI<CurrencyInfoRes>>('Auth/getGoodsInfo', currencyInfoReq);
//     if (response.data.resultCode === 0) {
//       return response.data; // Return on success
//     } else {
//       throw new Error(response.data.resultMessage); // Error handling
//     }
//   } catch (error: any) {
//     console.error('Error sendCurrencyInfo :', error);
//     throw new Error(`sendCurrencyInfo Error`); // Error handling
//   }
// };
