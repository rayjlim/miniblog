import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteCompression()
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./setupTests.js",
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: ['node_modules', 'dist'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      all: true,
      include: ['src/**/*.{js,jsx}'],
      exclude: ['node_modules', 'dist'],
    },
    alias: {
      'jest': 'vitest'
    }
  },
  'process.env': process.env
})
