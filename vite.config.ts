import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(() => ({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    cors: true,

    proxy: {
      "/api": {
        target: "http://localhost:5558",
        changeOrigin: true,
        secure: false,
        // rewrite: (path) => path.replace(/^\/api/, ""),
        configure: (proxy) => {
          proxy.on("error", (err) => {
            console.error("Proxy error:", err);
          });
          proxy.on("proxyReq", (proxyReq, req) => {
            console.log("Proxying:", req.method, req.url, "->", proxyReq.path);
          });
          proxy.on("proxyRes", (proxyRes, req) => {
            console.log("Proxy response:", proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },
}));
