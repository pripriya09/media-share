// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: 'localhost', // Use 'localhost' explicitly
//     port: 5173,        // You can choose any port you prefer
//     strictPort: true,   // Ensures Vite will fail if the port is already in use
//   },
// })


import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost", // Use '0.0.0.0' to allow all network interfaces

  },
});
