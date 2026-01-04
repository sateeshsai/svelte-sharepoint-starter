<script lang="ts">
  import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";

  export interface Filter {
    category: string;
    options: string[];
    selected: string[];
    description: string;
  }

  const { filter = $bindable(), type = "multiple" }: { filter: Filter; type: "single" | "multiple" } = $props();
</script>

<ToggleGroup.Root bind:value={filter.selected} class="flex flex-wrap gap-2" size="sm" type={type as "multiple"}>
  {#each filter.options as option}
    <ToggleGroup.Item class={`rounded! font-light data-[state=on]:font-normal bg-muted data-[state=on]:bg-muted-foreground data-[state=on]:text-white`} value={option}>{option}</ToggleGroup.Item>
  {/each}
</ToggleGroup.Root>
