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
    setupFiles: "./setupTests.js"
  },
  'process.env': process.env
})
