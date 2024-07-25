import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
    //   strategies: 'injectManifest',
    //   injectRegister: false,
    //   injectManifest: {
    //     swSrc: resolve(__dirname, 'service-worker.js'), // Path to the source service worker file
    //     swDest: 'sw.js' // Output path for the generated service worker
    //   },
        injectRegister: false,
        strategies: 'injectManifest',
        srcDir: '',
        filename: 'sw.js',
        injectManifest: {
            injectionPoint: undefined,
        },
        manifest: {
            "name": "Assessment and Survey app",
            "short_name": "Assessment/Survey app",
            "icons": [
                {
                    "src": "img/red_bird_256.webp",
                    "sizes": "256x256",
                    "purpose": "any",
                    "type": "image/png"
                }
            ],
            "start_url": "/",
            "display": "standalone",
            "orientation": "landscape",
            "incognito": "split",
            "background_color": "#fff",
            "theme_color": ""
        },
        workbox: {
            // defining cached files formats
            globPatterns: ["**/*.{js,css,html,ico,png,webp,svg,wav,webmanifest}"],
        }
    }),
  ],
  build: {
    outDir: 'dist', // Specify the output directory
    rollupOptions: {
        input: {
            main: resolve(__dirname, 'index.html'), // Path to the entry HTML file
        },
        output: {
            entryFileNames: 'assets/[name].[hash].js',
            chunkFileNames: 'assets/[name].[hash].js',
            assetFileNames: 'assets/[name].[hash].[ext]',
            manualChunks(id) {
                if (id.includes('node_modules')) {
                    return 'vendor';
                }
            },
        },
    },
    resolve: {
        alias: {
        '@': resolve(__dirname, 'src'),
        },
    },
  },
  server: {
    port: 3000,
    hot: true,
  },
});