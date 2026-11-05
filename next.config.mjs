/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // Replace with your actual Supabase project ref once created,
        // e.g. abcxyzproject.supabase.co
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default nextConfig;
