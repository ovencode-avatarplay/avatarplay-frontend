/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  basePath: process.env.BASEPATH,
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/en/main/homefeed',
        permanent: true,
        locale: false,
      },
      {
        source: '/:lang(en|ko|ar)',
        destination: '/:lang/main/homefeed',
        permanent: true,
        locale: false,
      },
      {
        source: '/((?!(?:en|ko|ar|front-pages|favicon.ico)\\b)):path',
        destination: '/en/:path',
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
    ignoreBuildErrors: true,
  },
};

// ESM 방식으로 export
export default nextConfig;
