import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  root: __dirname,
  base: './',
  plugins: [react()],
  build: { target: 'es2022', outDir: '/home/user/24-6/compare', emptyOutDir: true, assetsInlineLimit: 0 },
  server: { host: '127.0.0.1', fs: { allow: ['..'] } },
  resolve: { dedupe: ['react', 'react-dom'] },
})
