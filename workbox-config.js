module.exports = {
  globDirectory: 'build/',
  globPatterns: [
    '**/*.{wav,mp3,gif,WAV,png,webp,otf,jpg,jpeg,js,json,css,html,svg}',
    '**/manifest.json',
  ],
  maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
  swDest: 'build/sw.js',
  swSrc: 'sw-src.js',
  globIgnores: [
    'assets/audio/*/*.mp3',
    'assets/audio/*/*.wav',
    'workbox-config.js',
    'workbox-*.js',
    'workbox-*.js.map',
  ],
};