import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/open-todo/",
  css: {
    postcss: "./postcss.config.js",
  },
});
