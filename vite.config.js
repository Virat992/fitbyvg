import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // allows external access
    port: 5173, // optional, your dev server port
    strictPort: true, // optional, fail if port is busy
    allowedHosts: [
      "5c2e1aa0d7bb.ngrok-free.app", // replace with your ngrok URL
    ],
  },
});
