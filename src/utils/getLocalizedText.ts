import {LanguageType} from '@/app/NetWork/AuthNetwork';
import localizationData from '../data/textData/Localization.json';
import Cookies from 'js-cookie';

/**
 * 각 텍스트 항목의 언어별 텍스트 구조를 정의
 */
interface LocalizationItem {
  type?: string; // 선택적 속성
  [languageCode: string]: string | undefined; // 언어별 텍스트
}

/**
 * 각 Head 아래 LocalizationItem 그룹 정의
 */
interface LocalizationGroup {
  [key: string]: LocalizationItem;
}

/**
 * 전체 Localization JSON 데이터 정의
 */
interface LocalizationStrings {
  [head: string]: LocalizationGroup;
}

/**
 * URL에서 언어 코드 추출
 */
const getLanguageFromURL = (): string => {
  const pathSegments = window.location.pathname.split('/');
  const lang = pathSegments[1] as string;
  const supportedLocales = ['ko', 'en-US', 'ja', 'fr', 'es', 'zh-CN', 'zh-TW', 'pt-PT', 'de'];
  return supportedLocales.includes(lang) ? lang : 'ko'; // 기본 언어
};

/**
 * 런타임에서 type 필드를 동적으로 추가
 */
const transformLocalizationData = (data: any): LocalizationStrings => {
  const result: LocalizationStrings = {};
  Object.keys(data).forEach(head => {
    result[head] = {};
    Object.keys(data[head]).forEach(key => {
      const entry = data[head][key];
      result[head][key] = {
        type: head, // 각 항목에 Head를 type으로 추가
        ...entry, // 기존 데이터 병합
      };
    });
  });
  return result;
};

// JSON 데이터 변환
const localizationSources: LocalizationStrings = transformLocalizationData(localizationData);

/**
 * 언어에 맞는 텍스트를 반환하는 함수
 */
const getLocalizedText = (head: keyof LocalizationStrings, key: string, language?: string): string => {
  const effectiveLanguage = language || getLanguageFromURL();
  const group = localizationSources[head];

  // Head가 없거나 Key가 없을 경우 빈 문자열 반환
  if (!group || !group[key]) {
    console.warn(`Localization missing for key: ${key}, head: ${head}`);
    return '';
  }

  const localizedItem = group[key];

  // 언어별 데이터가 없으면 영어 기본값 반환
  return localizedItem[effectiveLanguage] || localizedItem['en-US'] || '';
};

// 브라우저 언어 설정을 LanguageType으로 변환
export const getBrowserLanguage = (): LanguageType => {
  const browserLang = navigator.language || 'en'; // 기본값으로 안전 처리

  if (browserLang.startsWith('ko')) return LanguageType.Korean;
  if (browserLang.startsWith('en')) return LanguageType.English;
  if (browserLang.startsWith('ja')) return LanguageType.Japanese;
  if (browserLang.startsWith('fr')) return LanguageType.French;
  if (browserLang.startsWith('es')) return LanguageType.Spanish;

  // 중국어 코드 처리
  if (browserLang.startsWith('zh')) {
    if (browserLang === 'zh-CN' || browserLang.includes('Hans')) {
      return LanguageType.ChineseSimplified; // 간체
    }
    if (browserLang === 'zh-TW' || browserLang.includes('Hant')) {
      return LanguageType.ChineseTraditional; // 번체
    }
  }

  if (browserLang.startsWith('pt')) return LanguageType.Portuguese;
  if (browserLang.startsWith('de')) return LanguageType.German;

  return LanguageType.English; // 기본값
};

// 쿠키에 저장딘 언어 설정을 LanguageType으로 변환
export const getCookiesLanguageType = (): LanguageType => {
  const langType = Cookies.get('language') || 'en-US';

  if (langType.startsWith('ko')) return LanguageType.Korean;
  if (langType.startsWith('en')) return LanguageType.English;
  if (langType.startsWith('ja')) return LanguageType.Japanese;
  if (langType.startsWith('fr')) return LanguageType.French;
  if (langType.startsWith('es')) return LanguageType.Spanish;
  if (langType.startsWith('zh')) {
    return langType.includes('Hans') ? LanguageType.ChineseSimplified : LanguageType.ChineseTraditional;
  }
  if (langType.startsWith('pt')) return LanguageType.Portuguese;
  if (langType.startsWith('de')) return LanguageType.German;

  return LanguageType.English; // 기본값
};
export default getLocalizedText;
