/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';

export default ({ mode }) =>
  defineConfig({
    plugins: [react(), eslint()],
    define: {
      'process.env.NODE_ENV': `"${mode}"`
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return undefined;
            if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/react-router')) return 'react';
            if (id.includes('/antd/') || id.includes('/@ant-design/') || id.includes('/rc-')) return 'antd';
            if (id.includes('/@fortawesome/')) return 'icons';
            if (id.includes('/i18next') || id.includes('/react-i18next/')) return 'i18n';
            if (id.includes('/dayjs/')) return 'date';
            return 'vendor';
          }
        }
      }
    },
    server: {
      watch: {
        usePolling: true
      },
      host: true,
      strictPort: true,
      port: 80
    }
  });
