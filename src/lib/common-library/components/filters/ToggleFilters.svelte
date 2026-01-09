<script lang="ts" module>
  /**
   * Filter configuration for ToggleFilters component.
   * Used to create filterable toggle groups with multi/single select capability.
   */
  export interface Filter {
    /** Unique category identifier for the filter group */
    category: string;
    /** Available filter options */
    options: string[];
    /** Currently selected options (bindable) */
    selected: string[];
    /** Optional description shown to users */
    description?: string;
  }
</script>

<script lang="ts">
  import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";

  const { filter = $bindable(), type = "multiple" }: { filter: Filter; type: "single" | "multiple" } = $props();
</script>

<ToggleGroup.Root bind:value={filter.selected} class="flex flex-wrap gap-2" size="sm" type={type as "multiple"}>
  {#each filter.options as option}
    <ToggleGroup.Item class={`rounded! font-light data-[state=on]:font-normal bg-muted data-[state=on]:bg-muted-foreground data-[state=on]:text-white`} value={option}>{option}</ToggleGroup.Item>
  {/each}
</ToggleGroup.Root>
