'use client';

import {sendGetLanguage, sendSignIn, SignInReq} from '@/app/NetWork/AuthNetwork';
import {getLangUrlCode} from '@/configs/i18n';

import {refreshLanaguage} from '@/utils/UrlMove';
import {i18n} from 'next-i18next';
import {useRouter} from 'next/navigation';

/*export const setSignIn = async () => {
  const router = useRouter(); // useRouter는 클라이언트에서만 사용

  const _language: string = getLangUrlCode(getBrowserLanguage());
  const reqData: SignInReq = {
    language: _language,
  };
  await sendSignIn(reqData);
  refreshLanaguage(undefined, router); // 언어 설정 후 라우팅
};*/

export const fetchLanguage = async (isLogined: boolean, router: ReturnType<typeof useRouter>) => {
  const response = await sendGetLanguage({});
  if (response) {
    const language = response.data?.languageType;
    refreshLanaguage(isLogined, language, router);
  }
};
