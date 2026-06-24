import type { NextConfig } from "next";

const securityHeaders = [
  // Prevents clickjacking — nobody can embed your site in an iframe
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Prevents MIME-type sniffing attacks
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Forces HTTPS for 2 years
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Controls referrer information
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disables browser features not needed
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  // DNS prefetch
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // Content Security Policy — allows only trusted sources
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Scripts: self + Vimeo player + inline scripts needed by Next.js
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' player.vimeo.com",
      // Styles: self + inline (needed by Tailwind/Next.js)
      "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
      // Images: self + data URIs + Vimeo thumbnails + NOWPayments
      "img-src 'self' data: blob: *.vimeo.com *.vimeocdn.com *.nowpayments.io",
      // Fonts
      "font-src 'self' fonts.gstatic.com",
      // Frames: Vimeo player only
      "frame-src player.vimeo.com",
      // API connections
      "connect-src 'self' *.vimeo.com *.vimeocdn.com formspree.io *.formspree.io *.nowpayments.io nowpaids.io",
      // Media (video/audio)
      "media-src 'self' *.vimeocdn.com",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
