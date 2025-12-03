/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    TICKETMASTER_API_KEY: process.env.TICKETMASTER_API_KEY,
  },
};

module.exports = nextConfig;

