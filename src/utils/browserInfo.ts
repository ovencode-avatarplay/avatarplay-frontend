// 쿼리 파라미터 키들을 정의하는 enum 타입

import {LanguageType} from '@/app/NetWork/network-interface/CommonEnums';
import Cookies from 'js-cookie';
import {getCurrentLanguage} from './UrlMove';

// 브라우저에서 파싱해서 추출할 key를 추가하면 됩니다
export enum QueryParams {
  ChattingInfo = 'v',
  Episode = 'episode',
}

// enum 값을 인자로 받아 해당하는 쿼리 파라미터를 반환하는 함수
export const getWebBrowserUrl = (param: QueryParams): string | null => {
  const url = window.location.href;
  const urlObj = new URL(url);
  const paramValue = urlObj.searchParams.get(param); // enum에서 지정한 키 값 가져오기

  return paramValue; // 해당하는 쿼리 파라미터 값 반환, 없으면 null 반환
};

/**
 * URL에서 언어 코드 추출
 */
export const getLanguageFromURL = (): string | null => {
  const pathSegments = window.location.pathname.split('/');
  const lang = pathSegments[1] as string;
  const supportedLocales = ['ko', 'en-US', 'ja', 'fr', 'es', 'zh-CN', 'zh-TW', 'pt-PT', 'de'];
  return supportedLocales.includes(lang) ? lang : null;
};

// 브라우저 언어 설정을 LanguageType으로 변환
export const getBrowserLanguage = (): LanguageType => {
  const browserLang = getCurrentLanguage(); // 기본값으로 안전 처리

  if (browserLang.startsWith('ko')) return LanguageType.Korean;
  if (browserLang.startsWith('en')) return LanguageType.English;
  if (browserLang.startsWith('ja')) return LanguageType.Japanese;
  if (browserLang.startsWith('fr')) return LanguageType.French;
  if (browserLang.startsWith('es')) return LanguageType.Spanish;

  // 중국어 코드 처리
  if (browserLang.startsWith('zh')) {
    if (browserLang === 'zh-CN' || browserLang.includes('Hans')) {
      return LanguageType.Simplified_Chinese; // 간체
    }
    if (browserLang === 'zh-TW' || browserLang.includes('Hant')) {
      return LanguageType.Traditional_Chinese; // 번체
    }
  }

  if (browserLang.startsWith('pt')) return LanguageType.Portuguese;
  if (browserLang.startsWith('de')) return LanguageType.German;

  return LanguageType.English; // 기본값
};

// 쿠키에 저장딘 언어 설정을 LanguageType으로 변환
export const getCookiesLanguageType = (): LanguageType => {
  const langType = Cookies.get('language') || 'ko';

  if (langType.startsWith('ko')) return LanguageType.Korean;
  if (langType.startsWith('en')) return LanguageType.English;
  if (langType.startsWith('ja')) return LanguageType.Japanese;
  if (langType.startsWith('fr')) return LanguageType.French;
  if (langType.startsWith('es')) return LanguageType.Spanish;
  if (langType.startsWith('zh')) {
    return langType.includes('Hans') ? LanguageType.Simplified_Chinese : LanguageType.Traditional_Chinese;
  }
  if (langType.startsWith('pt')) return LanguageType.Portuguese;
  if (langType.startsWith('de')) return LanguageType.German;

  return LanguageType.English; // 기본값
};

// 문자열에 맞는 언어타입
export const getLanguageTypeFromText = (language: string | null): LanguageType | undefined => {
  if (language === null) return undefined;

  if (language.startsWith('ko')) return LanguageType.Korean;
  if (language.startsWith('en')) return LanguageType.English;
  if (language.startsWith('ja')) return LanguageType.Japanese;
  if (language.startsWith('fr')) return LanguageType.French;
  if (language.startsWith('es')) return LanguageType.Spanish;
  if (language.startsWith('zh')) {
    return language.includes('Hans') ? LanguageType.Simplified_Chinese : LanguageType.Traditional_Chinese;
  }
  if (language.startsWith('pt')) return LanguageType.Portuguese;
  if (language.startsWith('de')) return LanguageType.German;

  return LanguageType.English; // 기본값은 영어
};
