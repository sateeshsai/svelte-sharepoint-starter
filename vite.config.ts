import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { router } from "sv-router/vite-plugin";
import { viteSingleFile } from "vite-plugin-singlefile";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), svelte({ extensions: [".svelte", ".md"] }), viteSingleFile(), router({ path: "src/routes", ignore: [/[A-Z].*\.svelte$/] })],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      $lib: path.resolve("./src/lib"),
      $routes: path.resolve("./src/routes"),
      $: path.resolve("./src"),
      "sv-router/generated": path.resolve("./.routes/generated"),
    },
  },

  build: { assetsInlineLimit: Number.POSITIVE_INFINITY },
});
