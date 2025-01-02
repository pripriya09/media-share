// 
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Use '0.0.0.0' to allow all network interfaces
    port: 5173, // The port to run Vite on
  },
});
