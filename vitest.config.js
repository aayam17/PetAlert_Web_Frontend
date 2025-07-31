import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config"; // Ensure this is from 'vitest/config'
// Remove path, fileURLToPath, dirname if you're not using the alias in tests
// For simplicity, let's remove the alias and __dirname if not strictly needed by test imports
// import path from "path";
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

export default defineConfig({
  plugins: [react()],
  // resolve: { // You can remove this block if your tests don't use the '@' alias
  //   alias: {
  //     "@": path.resolve(__dirname, "./src"),
  //   },
  // },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./setupTests.js", // <--- CORRECTED PATH: Removed './src/'
    // If you encounter "process is not defined" errors for older libraries,
    // you might need this:
    // browser: {
    //   enabled: true,
    //   name: 'chrome', // or 'chromium', 'firefox', 'edge'
    // },
    // deps: {
    //   inline: [/react-hot-toast/], // Try this if react-hot-toast errors persist
    // },
  },
});