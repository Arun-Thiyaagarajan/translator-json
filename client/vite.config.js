import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@components": resolve(__dirname, "src/components"),
      "@hooks": resolve(__dirname, "src/hooks"),
      "@store": resolve(__dirname, "src/store"),
      "@assets": resolve(__dirname, "src/assets"),
      "@pages": resolve(__dirname, "src/pages"),
      "@routes": resolve(__dirname, "src/routes"),
      "@services": resolve(__dirname, "src/services"),
      "@enums": resolve(__dirname, "src/enums"),
      "@data": resolve(__dirname, "src/data"),
    },
  },
});
