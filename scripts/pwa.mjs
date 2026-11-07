// After `expo export --platform web`: make dist/ installable from the iPhone home screen.
import { copyFileSync, existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';

const dist = 'dist';
for (const f of readdirSync('public')) if (!existsSync(`${dist}/${f}`)) copyFileSync(`public/${f}`, `${dist}/${f}`);

writeFileSync(`${dist}/manifest.webmanifest`, JSON.stringify({
  name: 'De Uno',
  short_name: 'De Uno',
  description: 'Spanish practice that keeps up with you.',
  start_url: '/',
  display: 'standalone',
  background_color: '#0c0907',
  theme_color: '#0c0907',
  icons: [
    { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
  ],
}, null, 2));

const tags = [
  '<link rel="manifest" href="/manifest.webmanifest">',
  '<link rel="apple-touch-icon" href="/apple-touch-icon.png">',
  '<meta name="apple-mobile-web-app-capable" content="yes">',
  '<meta name="mobile-web-app-capable" content="yes">',
  '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">',
  '<meta name="apple-mobile-web-app-title" content="De Uno">',
  '<meta name="theme-color" content="#0c0907">',
  '<style>html,body{background:#0c0907}</style>',
].join('\n');

let html = readFileSync(`${dist}/index.html`, 'utf8');
html = html.replace(/<meta name="viewport"[^>]*>/, '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">');
html = html.replace(/<title>[^<]*<\/title>/, '<title>De Uno</title>');
html = html.replace('</head>', `${tags}\n</head>`);
writeFileSync(`${dist}/index.html`, html);
console.log('PWA tags added to dist/index.html');
