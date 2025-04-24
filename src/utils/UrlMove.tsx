'use client';
import {i18n} from 'next-i18next'; // i18n 객체 가져오기
import {useRouter} from 'next/navigation';
import Cookies from 'js-cookie';
import {changeLanguage, getAuth} from '@/app/NetWork/AuthNetwork';
import {LanguageType} from '@/app/NetWork/network-interface/CommonEnums';
import {getLangUrlCode} from '@/configs/i18n';
import {setLanguage} from '@/redux-store/slices/UserInfo';
import {AppDispatch, store} from '@/redux-store/ReduxStore';
import {getBrowserLanguage, getLanguageFromURL, getLanguageTypeFromText, getWebBrowserUrl} from './browserInfo';
import {updateProfile} from '@/redux-store/slices/Profile';
import {supabase} from './supabaseClient';
import {useDispatch} from 'react-redux';

// 로그인상태인가
export const isLogined = async () => {
  1;
  const dispatch = store.dispatch;
  const jwt = localStorage.getItem('jwt');
  if (!jwt) {
    return false;
  }

  const resAuth = await getAuth();
  if (resAuth?.resultCode != 0) {
    localStorage.removeItem('jwt');
    await supabase.auth.signOut();
    return false;
  }

  if (resAuth.data?.profileSimpleInfo) {
    dispatch(updateProfile(resAuth.data?.profileSimpleInfo));
  }
  return true;
};

// 현지 언어로 변경
export const initLocalLanguage = () => {
  const dispatch = store.dispatch;
  const browserLang = getBrowserLanguage();

  dispatch(setLanguage(browserLang));
  const newLocale = getLangUrlCode(browserLang) || 'en-US';
  Cookies.set('language', String(newLocale), {expires: 365});
};

export const refreshLanaguage = (
  isLogined: boolean,
  language: LanguageType | undefined,
  router: ReturnType<typeof useRouter>,
) => {
  const dispatch = store.dispatch;
  try {
    // language 값이 있는 경우
    if (language !== undefined) {
      // 이미 같은 언어이면 패스
      if (language === getLanguageTypeFromText(getLanguageFromURL())) return;

      dispatch(setLanguage(language));

      Cookies.set('language', String(language), {expires: 365});
      changeLanguageAndRoute(language, router, undefined);
    } else {
      const browserLang = getBrowserLanguage();
      if (language === browserLang) return; // 이미 같은 언어이면 패스
      dispatch(setLanguage(browserLang));

      const newLocale = getLangUrlCode(browserLang) || 'en-US';
      Cookies.set('language', String(newLocale), {expires: 365});

      changeLanguageAndRoute(browserLang, router, undefined);
    }
  } catch (error) {
    console.error('Failed to fetch language:', error);
    const browserLang = getBrowserLanguage();
    dispatch(setLanguage(browserLang));

    const newLocale = getLangUrlCode(browserLang) || 'en-US';
    Cookies.set('language', String(newLocale), {expires: 365});
  }
};

// 현재 언어 가져오기 (url에서..)
export const getCurrentLanguage = (): string => {
  //return Cookies.get('language') || 'en-US';
  const language: string | null = getLanguageFromURL();
  if (language === null) return /*Cookies.get('language') ||*/ navigator.language; // 기본값은 브라우저 설정언어
  else return language;
};

// 언어에 맞는 URL 생성 함수
export const getLocalizedLink = (path: string): string => {
  const currentLanguage = getCurrentLanguage();
  return `/${currentLanguage}${path}`;
};

// 현재 언어에 맞는 URL로 라우팅 함수
export const pushLocalizedRoute = (
  path: string,
  router: ReturnType<typeof useRouter>,
  isReload = true,
  forceReload = false,
) => {
  const localizedUrl = getLocalizedLink(path);

  // 현재 브라우저 URL 확인
  const currentUrl = window.location.href;
  const newUrl = new URL(localizedUrl, window.location.origin);

  if (currentUrl !== newUrl.href) {
    // ✅ 다른 URL일 경우, 일반적인 라우팅 수행
    if (isReload) {
      router.push(localizedUrl);
    } else {
      window.history.replaceState(null, '', localizedUrl);
    }
  } else if (forceReload) {
    // ✅ 같은 URL이지만 강제 리로드할 경우
    if (isReload) {
      router.replace(localizedUrl); // Next.js의 히스토리 변경 방식
    } else {
      window.location.reload(); // 완전한 새로고침
    }
  }
};

// 언어 변경 및 라우팅 처리 함수
export const changeLanguageAndRoute = (
  newLanguage: LanguageType,
  router: ReturnType<typeof useRouter>,
  i18nInstance?: typeof i18n,
) => {
  const newLocale = getLangUrlCode(newLanguage) || 'en-US';
  Cookies.set('language', newLocale, {expires: 365});

  const currentUrl = new URL(window.location.href); // 현재 URL 가져오기
  const pathSegments = currentUrl.pathname.split('/');

  // 기존 경로에서 첫 번째 세그먼트가 언어 코드인 경우 교체
  if (/^[a-z]{2}(-[A-Za-z]{2,3})?$/.test(pathSegments[1])) {
    pathSegments[1] = newLocale;
  } else {
    // 언어 코드가 없으면 추가
    pathSegments.splice(1, 0, newLocale);
  }

  // 새로운 URL 생성
  const newPath = pathSegments.join('/');
  const newUrl = `${currentUrl.origin}${newPath}${currentUrl.search}${currentUrl.hash}`;

  // if (i18nInstance) {
  //   i18nInstance.changeLanguage(newLocale).catch(err => console.error('Failed to change language:', err));
  // } else {
  //   console.warn('i18nInstance is not initialized.');
  // }

  // 같은 URL을 또 push하지 말자.
  if (currentUrl.href !== newUrl) {
    router.push(newUrl);
  }
};

export const serverChangeLanguage = async (
  lang: LanguageType,
  dispatch: AppDispatch,
  router: ReturnType<typeof useRouter>,
) => {
  try {
    const value = lang;

    if (value === undefined || value === null) {
      throw new Error('Invalid language value');
    }

    const newLanguage = parseInt(String(value), 10) as LanguageType;

    const response = await changeLanguage({languageType: newLanguage});
    const language = response.data?.languageType;

    if (language !== undefined) {
      dispatch(setLanguage(language));
      changeLanguageAndRoute(language, router);
    } else {
      throw new Error('Failed to retrieve updated language from server');
    }
  } catch (error) {
    console.error('Failed to change language:', error);
  }
};
