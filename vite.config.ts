import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackStart(),
    nitro({
      preset: "vercel",
    }),
    viteReact(),
  ],

  resolve: {
    tsconfigPaths: true,
  },

  css: {
    postcss: {
      plugins: [],
    },
  },
});
