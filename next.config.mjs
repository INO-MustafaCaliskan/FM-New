/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  trailingSlash: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
          {
            key: "Content-Security-Policy",
            value: `
    default-src 'self';

    script-src
      'self'
      'unsafe-inline'
      'unsafe-eval'
      https://www.googletagmanager.com
      https://accounts.google.com/gsi/client
      https://app.mailjet.com
      https://*.zegocloud.com
      https://*.zego.im
      https://*.vakifbank.com.tr
      https://goguvenliodeme-preprod.bkmtest.com.tr
      https://inbound.apigatewaytest.vakifbank.com.tr:8443
      https://inbound.apigateway.vakifbank.com.tr/threeDGateway/startThreeDFlow
      https://inbound.apigateway.vakifbank.com.tr:8443
      https://appleid.cdn-apple.com;

    style-src 'self' 'unsafe-inline' https://accounts.google.com/gsi/style;
    img-src 'self' data: blob: https: https://cdndev.inomeetingsoftware.com https://cdn.inomeetingsoftware.com https://cdn.inoprojects.com;
    font-src 'self' https: data:;

    connect-src
      'self'
      https://www.google-analytics.com
      https://www.googletagmanager.com
      https://analytics.google.com
      https://accounts.google.com
      https://stats.g.doubleclick.net
      https://*.mailjet.com
      https://3dsecure.vakifbank.com.tr
      https://3dsecuretest.vakifbank.com.tr
      https://api.ipify.org
      https://3dsecure.vakifbank.com.tr/MPIAPI/Troy_ACS.aspx
      https://*.mjt.lu
      https://app.mailjet.com
      https://api.freighttalk.com
      https://api.freighttalk.com/api/
      https://talkapi.inoprojects.com
      https://talkapi.inoprojects.com/api/
      https://freighttalk.com
      https://hub.freighttalk.com
      https://ftalkhub.inoprojects.com
      wss://hub.freighttalk.com
      wss://ftalkhub.inoprojects.com
      https://*.freighttalk.com
      https://*.inoprojects.com
      wss://*.freighttalk.com
      wss://*.inoprojects.com
      https://*.zegocloud.com
      wss://*.zegocloud.com
      https://*.zego.im
      wss://*.zego.im
      https://*.coolgcloud.com
      wss://*.coolgcloud.com
      https://*.coolzcloud.com
      wss://*.coolzcloud.com
      https://*.coolfcloud.com
      wss://*.coolfcloud.com
      https://cdn.inomeetingsoftware.com
      https://cdndev.inomeetingsoftware.com
      https://challenges.cloudflare.com
      https://*.cloudflarestorage.com
      https://*.vakifbank.com.tr
      https://goguvenliodeme-preprod.bkmtest.com.tr
      https://inbound.apigatewaytest.vakifbank.com.tr:8443
      https://inbound.apigateway.vakifbank.com.tr/threeDGateway/startThreeDFlow
      https://inbound.apigateway.vakifbank.com.tr:8443;

    media-src 'self' https://cdndev.inomeetingsoftware.com https://cdn.inomeetingsoftware.com https://cdn.inoprojects.com googleusercontent.com;

    worker-src 'self' blob:;

    frame-src
      'self'
      https://accounts.google.com/
      https://sn1m3.mjt.lu
      https://*.mjt.lu
      https://*.vakifbank.com.tr
      https://*.zegocloud.com
      https://*.zego.im;

    frame-ancestors 'self';
    base-uri 'self';
    form-action
      'self'
      https://api.freighttalk.com
      https://talkapi.inoprojects.com
      https://*.vakifbank.com.tr
      https://3dsecure.vakifbank.com.tr
      https://3dsecure.vakifbank.com.tr/MPIAPI/Troy_ACS.aspx
      https://3dsecuretest.vakifbank.com.tr
      https://goguvenliodeme-preprod.bkmtest.com.tr
      https://inbound.apigatewaytest.vakifbank.com.tr:8443
      https://inbound.apigateway.vakifbank.com.tr:8443
      https://inbound.apigateway.vakifbank.com.tr/threeDGateway/startThreeDFlow
      https://*.mjt.lu;

    object-src 'none';
  `
              .replace(/\s{2,}/g, " ")
              .trim(),
          },
        ],
      },
    ];
  },

  // env bloğuna gerek yok:
  // NEXT_PUBLIC_* değişkenler otomatik olarak client'a açılır.
  // Diğerleri (HUB_URL vb.) NEXT_PUBLIC_ prefix'i ile .env dosyalarında tanımlanmıştır.
  // R2_SECRET_KEY ve R2_ACCESS_KEY yalnızca server-side API route'larında kullanılmalıdır.
  reactStrictMode: false,
  images: {
    remotePatterns: [
      // {
      //   protocol: "https",
      //   hostname: "localhost",
      //   port: "3000",
      //   pathname: "**",
      // },
      {
        protocol: "https",
        hostname: "cdn.inoprojects.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "cdn.inomeetingsoftware.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "cdndev.inomeetingsoftware.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
        port: "",
        pathname: "**",
      },
      // Added support for Google user content images used by Google profile pictures
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
        port: "",
        pathname: "**",
      },
    ],
  },
  output: "standalone",
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
};

export default nextConfig;
