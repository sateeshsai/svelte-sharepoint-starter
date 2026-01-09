<script lang="ts" module>
  /**
   * Re-export Filter type from common-library for backward compatibility.
   * @deprecated Import from "$lib/common-library/components/filters" instead.
   */
  export type { Filter } from "$lib/common-library/components/filters/ToggleFilters.svelte";
</script>

<script lang="ts">
  /**
   * @deprecated Use ToggleFilters from "$lib/common-library/components/filters" instead.
   * This component remains for backward compatibility.
   */
  import ToggleFilters, { type Filter } from "$lib/common-library/components/filters/ToggleFilters.svelte";

  let { filter = $bindable(), type = "multiple" }: { filter: Filter; type: "single" | "multiple" } = $props();
</script>

<ToggleFilters bind:filter {type} />
