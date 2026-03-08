import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import type { Plugin } from 'vite';
import { nitro } from 'nitro/vite';
import viteReact from '@vitejs/plugin-react';
import { devtools } from '@tanstack/devtools-vite';

const SSR_STUB_ID = '\0ssr-client-only-stub';
const CLIENT_ONLY_PACKAGES = [
  'leaflet',
  'react-leaflet',
  '@react-leaflet/core',
];

const ssrClientOnlyStub: Plugin = {
  name: 'ssr-client-only-stub',
  enforce: 'pre',
  resolveId(id, _importer, options) {
    if (options?.ssr && CLIENT_ONLY_PACKAGES.includes(id)) {
      return SSR_STUB_ID;
    }
  },
  load(id) {
    if (id === SSR_STUB_ID) {
      return `
        const fn = () => ({})
        const proxy = new Proxy(fn, { get: () => proxy, apply: () => ({}) })
        export default proxy
        export const MapContainer = proxy
        export const Marker = proxy
        export const Popup = proxy
        export const TileLayer = proxy
        export const useMap = () => ({})
        export const divIcon = fn
      `;
    }
  },
};

export default defineConfig({
  server: { port: 3000 },
  plugins: [
    devtools(),
    nitro(),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tanstackStart(),
    viteReact(),
    // ssrClientOnlyStub,
    // tanstackStart({ srcDirectory: 'src' }),
    // react(),
    // viteTsConfigPaths(),
  ],
  nitro: {
    preset: 'aws-lambda',
    awsLambda: {
      streaming: true,
    },
  },
  optimizeDeps: {
    exclude: [
      '@tanstack/start-server-core',
      '@tanstack/start-client-core',
      '@tanstack/start-storage-context',
    ],
  },
  environments: {
    client: {
      build: {
        rollupOptions: {
          external: [
            'sst',
            /^sst\//,
            /^@aws-sdk\//,
            'fs',
            'node:fs',
            'path',
            'node:path',
            'os',
            'node:os',
            'crypto',
            'node:crypto',
            'stream',
            'node:stream',
          ],
        },
      },
    },
  },
});
