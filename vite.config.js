/** @type {import('vite').UserConfig} */
import { resolve } from 'path';

export default {
  server: {
    port: 1234,
    host: true,
  },
  root: './src',
  base: '/pulsar/',
  build: {
    outDir: '../docs',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src', 'index.html'),
        nested: resolve(__dirname, 'src', 'gif.html'),
      },
    },
  },
};
