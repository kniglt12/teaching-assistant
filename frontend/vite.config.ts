import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  console.log('Build mode:', mode);
  console.log('VITE_BASE_PATH:', env.VITE_BASE_PATH);
  console.log('VITE_API_URL:', env.VITE_API_URL);

  return {
    plugins: [react()],
    // GitHub Pages 部署时设置 base 路径
    base: env.VITE_BASE_PATH || '/',
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
  };
});
