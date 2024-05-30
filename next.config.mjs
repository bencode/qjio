/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...config.externals, 'pg', 'knex', 'oracledb'];
    }
    return config
  }
};

export default nextConfig;
