import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // 3000 and 3001 are taken by the other trackers running locally.
    port: 3002,
    open: true,
  },
  build: {
    outDir: "build",
  },
});
