// next-i18next.config.js
export default {
  i18n: {
    locales: ["ko", "en-US", "ja", "fr", "es", "zh-CN", "zh-TW", "pt-PT", "de"], // 지원할 언어 목록
    defaultLocale: "en-US", // 기본 언어
  },
  reloadOnPrerender: process.env.NODE_ENV === "development", // 개발 모드에서만 리로딩
};
