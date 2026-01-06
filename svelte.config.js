import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { mdsvex } from "mdsvex";

/** @type {import("@sveltejs/vite-plugin-svelte").SvelteConfig} */
export default {
  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
  // for more information about preprocessors
  extensions: [".svelte", ".md"],
  preprocess: [
    mdsvex({
      extensions: [".md"],
    }),
    vitePreprocess(),
  ],
  compilerOptions: {
    experimental: {
      async: true,
    },
  },
};
