/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "image.tmdb.org" },
    ],
  },
};

module.exports = nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['image.tmdb.org'], // Crucial for TMDB posters
  },
  // This helps if you're using getServerSideProps a lot
  experimental: {
    serverComponentsExternalPackages: ['react-i18next'], // If you use i18n
  },
  // Prevents infinite builds if you have a lot of dynamic pages
  staticPageGenerationTimeout: 60,
};

module.exports = nextConfig;
