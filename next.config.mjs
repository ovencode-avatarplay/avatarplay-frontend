/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  basePath: process.env.BASEPATH,
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/en-US/main/homefeed',
        permanent: true,
        locale: false,
      },
      {
        source: '/:lang(en-US|ko|ja|fr|es|zh-CN|zh-TW|pt-PT|de)',
        destination: '/:lang/main/homefeed',
        permanent: true,
        locale: false,
      },
      {
        source: '/((?!(?:en-US|ko|ja|fr|es|zh-CN|zh-TW|pt-PT|de|front-pages|favicon.ico)\\b)):path',
        destination: '/en-US/:path',
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
