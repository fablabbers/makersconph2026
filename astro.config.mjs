// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";


// https://astro.build/config
export default defineConfig({
  site: "https://www.fablabbers.github.io/makersconph2026",
  vite: {
    plugins: [tailwindcss()],
  },
});