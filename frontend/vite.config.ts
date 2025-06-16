import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';          // ← 1

const __dirname = dirname(fileURLToPath(import.meta.url)); // ← 2

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),        // ← 3  now recognised
    },
  },
});
