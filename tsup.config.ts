import { defineConfig } from 'tsup';

export default defineConfig((options) => ({
  format: ['esm'],
  entry: ['src/index.ts'],
  dts: true,
  shims: true,
  skipNodeModulesBundle: true,
  minify: !options.watch,
  clean: true,
  cjsInterop: true,
}));