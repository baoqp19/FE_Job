import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      components: `${path.resolve(__dirname, "./src/components/")}`,
      styles: `${path.resolve(__dirname, "./src/styles/")}`,
      config: `${path.resolve(__dirname, "./src/config/")}`,
      pages: `${path.resolve(__dirname, "./src/pages/")}`,
      types: `${path.resolve(__dirname, "./src/types/")}`,
    },
  },
})
