/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      if (process.env.NODE_ENV === 'development') {
        return [
          {
            source: '/l0o0ng',
            destination: 'http://localhost:3001/l0o0ng',
          },
        ];
      }
  
      return [];
    },
  };
  
  export default nextConfig;
  