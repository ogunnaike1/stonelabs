// NEXT_DIST_DIR lets a production build run in its own folder, so it never overwrites the cache of a running `next dev`.
const nextConfig = { reactStrictMode: false, distDir: process.env.NEXT_DIST_DIR || '.next' };
export default nextConfig;
