import {LanguageType} from '@/app/NetWork/network-interface/CommonEnums';

export const i18n = {
  defaultLocale: 'ko',
  locales: ['ko', 'en-US', 'ja', 'fr', 'es', 'zh-CN', 'zh-TW', 'pt-PT', 'de'],
  langDirection: {
    //en: 'ltr',
    'en-US': 'ltr',
    ko: 'ltr',
    ja: 'ltr',
    fr: 'ltr',
    es: 'ltr',
    'zh-CN': 'ltr',
    'zh-TW': 'ltr',
    'pt-PT': 'ltr',
    de: 'ltr',
  },
} as const;

export type Locale = (typeof i18n)['locales'][number];

// 언어가 변경될 때 URL 경로와 언어 코드가 동기화되도록 하기 위한 설정
export const getLocaleUrl = (locale: Locale): string => {
  return `/${locale}/main/homefeed`; // 예: "/en-US/main/homefeed", "/ko/main/homefeed" 등
};

export const getLangUrlCode = (langType: LanguageType): string => {
  return i18n.locales[langType] ? i18n.locales[langType] : i18n.defaultLocale;
};
