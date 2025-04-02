import process from "process"; // ✅ process 명시적 import

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  basePath: process.env.BASEPATH || "", // ✅ 환경 변수 적용

  // redirects: async () => [
  //   {
  //     source: "/", // 루트 경로
  //     destination: "/en-US/main/homefeed", // 기본 언어로 리다이렉트
  //     permanent: true,
  //     locale: false, // locale 처리 비활성화
  //   },
  //   {
  //     source: "/:lang(ko|en-US|ja|fr|es|zh-CN|zh-TW|pt-PT|de)", // 언어 코드가 포함된 경우
  //     destination: "/:lang/main/homefeed",
  //     permanent: true,
  //     locale: false,
  //   },
  //   {
  //     source: "/((?!(ko|en-US|ja|fr|es|zh-CN|zh-TW|pt-PT|de|front-pages|favicon.ico)\\b)):path", // 언어 코드가 없는 경우
  //     destination: "/en-US/:path",
  //     permanent: true,
  //     locale: false,
  //   },
  // ],

  typescript: {
    ignoreBuildErrors: true,
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            icon: true,
          },
        },
      ],
    });
    return config;
  },
};

export default nextConfig;
