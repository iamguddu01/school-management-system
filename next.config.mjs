/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  devIndicators: false,
  images:{
    remotePatterns:[
      {
        protocol:"https",
        hostname: "**",
      },
    ]
  }
};

export default nextConfig;
