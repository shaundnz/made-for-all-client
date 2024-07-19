/// <reference types="vitest" />
import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/testing/setupTests.ts',
    exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**', '**/cdk/**'],
    coverage: {
      include: ['src/**'],
    },
  },
});
