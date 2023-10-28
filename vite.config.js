/** @type {import('vite').UserConfig} */

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
  },
};
