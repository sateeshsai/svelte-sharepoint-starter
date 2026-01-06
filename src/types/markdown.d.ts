declare module "*.md" {
  import type { SvelteComponent } from "svelte";
  const component: typeof SvelteComponent;
  export default component;
}
