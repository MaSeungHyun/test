import { defineConfig } from "vite";
import path from "node:path";
import electron from "vite-plugin-electron/simple";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/** Vercel / build:web — React만 빌드, Electron 제외 */
const isWebOnly =
  process.env.VERCEL === "1" ||
  process.env.BUILD_TARGET === "web" ||
  process.env.npm_lifecycle_event === "build:web" ||
  process.env.npm_lifecycle_event === "dev:web";

// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: ["**/*.glb"],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [
    tailwindcss(),
    react(),
    ...(isWebOnly
      ? []
      : [
          electron({
            main: {
              entry: "electron/main.ts",
            },
            preload: {
              input: path.join(__dirname, "electron/preload.ts"),
            },
            renderer:
              process.env.NODE_ENV === "test"
                ? undefined
                : {},
          }),
        ]),
  ],
});
