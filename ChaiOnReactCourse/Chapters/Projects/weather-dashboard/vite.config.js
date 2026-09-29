import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api/serpapi": {
          target: "https://serpapi.com",
          changeOrigin: true,
          rewrite: (path) =>
            path.replace(/^\/api\/serpapi/, "/search.json") + `&api_key=${env.SERPAPI_KEY}`,
        },
      },
    },
  };
});