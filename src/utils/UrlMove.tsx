import {i18n} from 'next-i18next'; // i18n 객체를 가져오기 위한 임포트
import {useRouter} from 'next/navigation';
import Cookies from 'js-cookie';
import {LanguageType} from '@/app/NetWork/AuthNetwork';
import {getLangUrlCode} from '@/configs/i18n';

// 현재 언어 가져오기 (쿠키에서)
export const getCurrentLanguage = (): string => {
  const lang = Cookies.get('language');
  return lang || '';
};

// 언어에 맞는 URL을 반환하는 함수
export const getLocalizedLink = (path: string): string => {
  //const currentLanguage = i18nInstance?.language || 'en-US'; // i18n 인스턴스를 사용하여 언어 가져오기, 기본값 'en-US'
  const currentLanguage = getCurrentLanguage() || 'en-US'; // i18n 인스턴스를 사용하여 언어 가져오기, 기본값 'en-US'

  // 언어 기반 URL 생성
  return `/${currentLanguage}${path}`;
};

// 현재 언어에 맞는 URL로 라우팅하는 함수
export const pushLocalizedRoute = (path: string, router: ReturnType<typeof useRouter>) => {
  // 현재 언어에 맞는 URL을 생성
  const localizedUrl = getLocalizedLink(path);

  // 새로운 URL로 라우팅
  router.push(localizedUrl);
};

// 언어 변경 및 라우팅 처리 함수
export const changeLanguageAndRoute = (
  newLanguage: LanguageType,
  router: ReturnType<typeof useRouter>,
  i18nInstance: typeof i18n,
) => {
  // 언어 변경 및 상태 업데이트
  Cookies.set('language', String(getLangUrlCode(newLanguage) || 'lang'), {expires: 365});

  // 언어 코드 가져오기
  const newLocale = getLangUrlCode(newLanguage); // 해당 언어에 맞는 URL 코드 생성

  // 현재 페이지에서 언어만 변경하여 다시 라우팅
  const currentUrl = window.location.href; // 현재 URL

  // URL에서 언어를 제외하고 새로운 언어로 변경된 URL 생성
  const newUrl = currentUrl.replace(/\/(:lang|ko|en-US|ja|fr|es|zh-CN|zh-TW|pt-PT|de)/, `/${newLocale}`);

  // i18n 인스턴스의 언어를 업데이트 (선택적으로 적용)
  i18nInstance?.changeLanguage(newLocale);

  // 새 URL로 라우팅
  router.push(newUrl); // 새 URL로 이동
};
