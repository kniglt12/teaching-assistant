import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages 部署时设置 base 路径
  // 如果仓库名是 teaching-assistant，则设置为 '/teaching-assistant/'
  // 如果使用自定义域名或 username.github.io，则设置为 '/'
  base: process.env.VITE_BASE_PATH || '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/store': path.resolve(__dirname, './src/store'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/types': path.resolve(__dirname, './src/types'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // 生成相对路径的资源引用
    assetsDir: 'assets',
    // 增加 chunk 大小警告阈值
    chunkSizeWarningLimit: 1000,
  },
});
