import {LanguageType} from '@/app/NetWork/network-interface/CommonEnums';
import localizationData from '../data/textData/Localization.json';
import Cookies from 'js-cookie';
import {getLanguageFromURL} from './browserInfo';

/**
 * 각 텍스트 항목의 언어별 텍스트 구조를 정의
 */
interface LocalizationItem {
  [languageCode: string]: string | undefined; // 언어별 텍스트
}

/**
 * 전체 Localization JSON 데이터 정의
 */
interface LocalizationStrings {
  [key: string]: LocalizationItem; // head 없이 key만 사용
}

/**
 * 런타임에서 type 필드를 동적으로 추가하지 않음
 */
const transformLocalizationData = (data: any): LocalizationStrings => {
  const result: LocalizationStrings = {};
  Object.keys(data).forEach(key => {
    result[key] = {...data[key]}; // key를 그대로 사용하고, 기존 데이터를 병합
  });
  return result;
};

// JSON 데이터 변환
const localizationSources: LocalizationStrings = transformLocalizationData(localizationData);

/**
 * 언어에 맞는 텍스트를 반환하는 함수
 */
/*const getLocalizedText = (head?: string, key: string, language?: string): string => {
  const effectiveLanguage = language || getLanguageFromURL();

  const localizedItem = localizationSources[key];

  // Key가 없을 경우 빈 문자열 반환
  if (!localizedItem) {
    console.warn(`로컬라이징 작업 필요: ${key}`);
    return `로컬라이징 작업 필요: ${key}`;
  }

  if (effectiveLanguage === null) return localizedItem['en-US'] || '';

  // 언어별 데이터가 없으면 영어 기본값 반환
  return localizedItem[effectiveLanguage] || localizedItem['en-US'] || '';
};*/

const getLocalizedText = (...args: [string] | [string, string] | [string, string, string]): string => {
  let head: string | undefined;
  let key: string;
  let language: string | undefined;

  if (args.length === 1) {
    [key] = args;
  } else if (args.length === 2) {
    [head, key] = args;
  } else {
    [head, key, language] = args;
  }

  const effectiveLanguage = language || getLanguageFromURL();
  const localizedItem = localizationSources[key];
  // Key가 없을 경우 빈 문자열 반환
  if (!localizedItem) {
    console.warn(`로컬라이징 작업 필요: ${key}`);
    return `로컬라이징 작업 필요: ${key}`;
  }

  if (effectiveLanguage === null) return localizedItem['en-US'] || '';

  // 언어별 데이터가 없으면 영어 기본값 반환
  return localizedItem[effectiveLanguage] || `로컬라이징 작업 필요: ${key}`;
};

export default getLocalizedText;
