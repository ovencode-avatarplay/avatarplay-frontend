/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    basePath: process.env.BASEPATH,
    redirects: async () => {
      return [
        {
          source: '/',
          destination: '/en/main',
          permanent: true,
          locale: false
        },
        {
          source: '/:lang(en|fr|ar)',
          destination: '/:lang/main',
          permanent: true,
          locale: false
        },
        {
          source: '/((?!(?:en|fr|ar|front-pages|favicon.ico)\\b)):path',
          destination: '/en/:path',
          permanent: true,
          locale: false
        }
      ]
    }};

export default nextConfig;
