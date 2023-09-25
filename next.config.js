// @ts-check

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});
const withSvgr = require('next-svgr');
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  eslint: {
    dirs: ['src']
  },
  swcMinify: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      }
    ],
    formats: ['image/avif', 'image/webp']
  }
};

module.exports = () => {
  const plugins = [withBundleAnalyzer, withSvgr];
  return plugins.reduce((acc, plugin) => plugin(acc), { ...nextConfig });
};
