/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  basePath: process.env.BASEPATH,
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/en-US/main/homefeed", // 기본 언어로 리다이렉트
        permanent: true,
        locale: false,
      },
      {
        source: "/:lang(ko|en-US|ja|fr|es|zh-CN|zh-TW|pt-PT|de)", // 다른 언어들이 있을 경우 해당 언어로 리다이렉트
        destination: "/:lang/main/homefeed", // 각 언어에 맞는 페이지로 리디렉트
        permanent: true,
        locale: false,
      },
      {
        source:
          "/((?!(?:ko|en-US|ja|fr|es|zh-CN|zh-TW|pt-PT|de|front-pages|favicon.ico)\\b)):path",
        destination: "/en-US/:path",
        permanent: true,
        locale: false,
      },
    ];
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: false,
  },
};

// ESM 방식으로 export
export default nextConfig;
