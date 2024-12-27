import {i18n} from 'next-i18next'; // i18n 객체 가져오기
import {useRouter} from 'next/navigation';
import Cookies from 'js-cookie';
import {LanguageType} from '@/app/NetWork/AuthNetwork';
import {getLangUrlCode} from '@/configs/i18n';

// 현재 언어 가져오기 (쿠키에서)
export const getCurrentLanguage = (): string => {
  return Cookies.get('language') || 'en-US';
};

// 언어에 맞는 URL 생성 함수
export const getLocalizedLink = (path: string): string => {
  const currentLanguage = getCurrentLanguage();
  return `/${currentLanguage}${path}`;
};

// 현재 언어에 맞는 URL로 라우팅 함수
export const pushLocalizedRoute = (path: string, router: ReturnType<typeof useRouter>) => {
  const localizedUrl = getLocalizedLink(path);

  // 브라우저에서 현재 URL 확인
  const currentUrl = window.location.href;
  const newUrl = new URL(localizedUrl, window.location.origin);

  if (currentUrl !== newUrl.href) {
    router.push(localizedUrl);
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

  if (i18nInstance) {
    i18nInstance.changeLanguage(newLocale).catch(err => console.error('Failed to change language:', err));
  } else {
    console.warn('i18nInstance is not initialized.');
  }

  // 같은 URL을 또 push하지 말자.
  if (currentUrl.href !== newUrl) {
    router.push(newUrl);
  }
};
