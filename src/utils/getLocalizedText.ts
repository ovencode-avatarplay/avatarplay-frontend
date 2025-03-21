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
  [key: string]: LocalizationItem; // head 없이 key만 사용 (소문자)
}

/**
 * 런타임에서 모든 key를 소문자로 변환
 */
const transformLocalizationData = (data: any): LocalizationStrings => {
  const result: LocalizationStrings = {};
  Object.keys(data).forEach(key => {
    result[key.toLowerCase()] = {...data[key]};
  });
  return result;
};

// JSON 데이터 변환
const localizationSources: LocalizationStrings = transformLocalizationData(localizationData);

/**
 * 언어에 맞는 텍스트를 반환하는 함수
 */
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
  const lowerKey = key?.toLowerCase();
  const localizedItem = localizationSources[lowerKey];

  if (!localizedItem) {
    console.warn(`로컬라이징 작업 필요: ${key}`);
    return `로컬라이징 작업 필요: ${key}`;
  }

  if (effectiveLanguage === null) return localizedItem['en-US'] || '';

  return localizedItem[effectiveLanguage] || localizedItem['en-US'] || '';
};

export default getLocalizedText;
