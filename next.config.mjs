/** @type {import('next').NextConfig} */
const nextConfig = {
  //
  reactStrictMode: false,
  basePath: process?.env?.BASEPATH || "", // basePath는 비워두거나 설정된 환경변수 사용
  // redirects: async () => {
  //   return [
  //     {
  //       source: "/", // 루트 경로
  //       destination: "/en-US/main/homefeed", // 기본 언어로 리다이렉트
  //       permanent: true,
  //       locale: false, // locale 처리를 하지 않도록 설정
  //     },
  //     {
  //       source: "/:lang(ko|en-US|ja|fr|es|zh-CN|zh-TW|pt-PT|de)", // 각 언어별 경로
  //       destination: "/:lang/main/homefeed", // 언어별 경로로 리디렉트
  //       permanent: true,
  //       locale: false,
  //     },
  //     {
  //       source:
  //         "/((?!(?:ko|en-US|ja|fr|es|zh-CN|zh-TW|pt-PT|de|front-pages|favicon.ico)\\b)):path", // 언어 코드가 없을 경우
  //       destination: "/en-US/:path", // 기본 언어로 리다이렉트
  //       permanent: true,
  //       locale: false,
  //     },
  //   ];
  // },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
