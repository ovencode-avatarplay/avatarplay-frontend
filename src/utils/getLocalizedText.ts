import {LanguageType} from '@/app/NetWork/network-interface/CommonEnums';
import localizationData from '../data/textData/Localization.json';
import Cookies from 'js-cookie';
import {getLanguageFromURL} from './browserInfo';

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
    console.warn(`로컬라이징 작업 필요: ${key}, head: ${head}`);
    return `로컬라이징 작업 필요: ${key}, head: ${head}`;
  }

  const localizedItem = group[key];

  if (effectiveLanguage === null) return localizedItem['en-US'] || '';

  // 언어별 데이터가 없으면 영어 기본값 반환
  return localizedItem[effectiveLanguage] || localizedItem['en-US'] || '';

  // if (effectiveLanguage === null) return '';

  // // 언어별 데이터가 없으면 Key + 언어 반환 ( LQA 용도 )
  // return localizedItem[effectiveLanguage] || key + '_' + effectiveLanguage;
};

export default getLocalizedText;
