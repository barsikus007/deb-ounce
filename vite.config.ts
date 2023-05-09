import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import eslintPlugin from '@nabla/vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
  base: "/deb-ounce/",
  plugins: [react(), eslintPlugin (), tsconfigPaths()],
  resolve: {
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat'
    },
  }
});
