// NEXT_DIST_DIR lets a production build run in its own folder, so it never overwrites the cache of a running `next dev`.
const nextConfig = { reactStrictMode: false, distDir: process.env.NEXT_DIST_DIR || '.next', images: { formats: ['image/avif', 'image/webp'], deviceSizes: [360, 640, 828, 1080, 1440, 1920], minimumCacheTTL: 31536000 } };
export default nextConfig;
