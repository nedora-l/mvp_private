/** @type {import('next').NextConfig} */
import fs from 'fs';
import path from 'path';

// Check if we have SSL certificates
const certsDir = path.join(process.cwd(), 'certificates');
const hasCertificates = fs.existsSync(path.join(certsDir, 'localhost.pem')) && 
                       fs.existsSync(path.join(certsDir, 'localhost-key.pem'));

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Apply HTTPS headers in development mode
  async headers() {
    return process.env.NODE_ENV === 'development' ? [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ] : [];
  },
  // Webpack configuration to handle WebSocket dependencies
  webpack: (config, { isServer }) => {
    if (isServer) {
      // For server-side rendering, we need to properly handle native modules
      config.externals = config.externals || [];
      config.externals.push({
        'bufferutil': 'commonjs bufferutil',
        'utf-8-validate': 'commonjs utf-8-validate',
      });
    } else {
      // For client-side, we need to provide fallbacks
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'bufferutil': false,
        'utf-8-validate': false,
      };
    }
    return config;
  },
  // The experimental field is used for Next.js-recognized experimental features
  experimental: {
    /*
    // Add HTTPS configuration here instead of at the root
    ...(process.env.HTTPS === 'true' && hasCertificates ? {
      https: {
        key: fs.readFileSync(path.join(certsDir, 'localhost-key.pem')),
        cert: fs.readFileSync(path.join(certsDir, 'localhost.pem')),
      }
    } : {}) */
  }
}

// Set environment variables for HTTPS
if (hasCertificates && process.env.NODE_ENV === 'development') {
  /*
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';  // Needed for self-signed certs
  process.env.HTTPS = 'true';
  process.env.SSL_CRT_FILE = path.join(certsDir, 'localhost.pem');
  process.env.SSL_KEY_FILE = path.join(certsDir, 'localhost-key.pem');
  */
}

export default nextConfig;
