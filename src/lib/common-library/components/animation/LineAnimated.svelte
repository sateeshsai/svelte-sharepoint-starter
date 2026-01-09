<script lang="ts">
  import { cn } from "$lib/utils";
  import { IsInViewport } from "runed";
  let targetNode = $state<HTMLElement>()!;
  const inViewport = new IsInViewport(() => targetNode);

  const { axis = "x", class: className }: { axis?: "x" | "y"; class?: string } = $props();
</script>

<div
  bind:this={targetNode}
  class={cn(
    "border border-foreground/50 transition-all delay-500 duration-1000",
    axis === "x" ? "w-full scale-x-0 origin-left" : "h-full grid scale-y-0 origin-top",
    inViewport.current ? (axis === "x" ? "scale-x-100" : "scale-y-100") : null,
    className
  )}
></div>
