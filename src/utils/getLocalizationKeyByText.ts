import localizationData from '../data/textData/Localization.json';

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

/**
 * 입력한 텍스트와 언어 코드에 맞는 로컬라이징 key를 반환
 * @param text 찾고자 하는 실제 문자열
 * @param language 언어 코드 (예: 'en-US')
 * @returns 해당 언어에서 매칭되는 key (없을 경우 undefined)
 */

const localizationSources: LocalizationStrings = transformLocalizationData(localizationData);
export const getLocalizationKeyByText = (text: string, language: string = 'en-US'): string | undefined => {
  const normalizedText = text.trim().toLowerCase();

  for (const key in localizationSources) {
    const localizedItem = localizationSources[key];
    const value = localizedItem[language];

    if (value?.trim().toLowerCase() === normalizedText) {
      return key;
    }
  }

  return undefined;
};
