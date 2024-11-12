import localizedSystemMessage from '../data/textData/systemMessage.json';
import localizedUI from '../data/textData/ui.json';

import {i18n, Locale} from '@/configs/i18n';

/**
 * 각 텍스트 항목의 언어별 텍스트 구조를 정의
 * 언어 코드를 키로, 텍스트를 값으로 가지는 객체
 */
interface LocalizationItem {
  [languageCode: string]: string;
}

/**
 * 전체 localizationString 객체의 구조 정의 ({키값 {언어 1,2,3,4}})
 */
interface LocalizationStrings {
  [key: string]: LocalizationItem;
}

const localizationSources: {[key: string]: LocalizationStrings} = {
  systemMessage: localizedSystemMessage as LocalizationStrings,
  ui: localizedUI as LocalizationStrings,
};

/**
 * localizationString JSON 파일을 LocalizationStrings 타입으로 설정
 */
const localizationData: LocalizationStrings = localizedSystemMessage;

/**
 * URL에서 언어 코드 추출
 */
const getLanguageFromURL = (): string => {
  const pathSegments = window.location.pathname.split('/');
  const lang = pathSegments[1] as Locale; // URL의 첫 번째 세그먼트를 언어 코드로 추출

  // URL에서 추출한 언어가 i18n.locales에 존재하면 해당 언어 반환, 아니면 기본 언어 반환
  return i18n.locales.includes(lang) ? lang : i18n.defaultLocale;
};

/**
 * 언어에 맞는 텍스트를 반환하는 함수
 * @param {string} key - JSON 파일의 키값 (ex: "sample_text")
 * @param {string} source - JSON 파일 소스 ("systemMessage", "ui" , "etc")
 * @param {string} language - 현재 선택된 언어 코드 (옵션, 기본값은 URL에서 가져옴)
 * @returns {string} - 해당 언어로 변환된 텍스트
 */

const getLocalizedText = (key: string, source: 'systemMessage' | 'ui' | 'etc' = 'ui', language?: string): string => {
  // 언어가 명시되지 않은 경우 URL에서 언어를 가져옴
  const effectiveLanguage = language || getLanguageFromURL();
  const localizationData = localizationSources[source]; // source 명시 안하면 ui
  const localizedItem = localizationData[key];

  // 해당 언어가 있는지 확인, 없으면 기본 영어 텍스트 반환
  if (localizedItem && localizedItem[effectiveLanguage]) {
    return localizedItem[effectiveLanguage];
  }

  // 언어가 없거나 key가 존재하지 않을 때 기본적으로 영어 텍스트를 반환
  return localizedItem?.en || '';
};

export default getLocalizedText;
