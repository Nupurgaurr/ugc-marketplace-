/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/client/discover', destination: '/discover', permanent: true },
      { source: '/creator/register', destination: '/become-a-creator/apply', permanent: true },
      { source: '/client/brief', destination: '/client/briefs/new', permanent: true },
    ];
  },
};

export default nextConfig;
