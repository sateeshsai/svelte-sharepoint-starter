<script lang="ts">
  import type { Snippet } from "svelte";
  import AreaChart from "./_components/_charts/AreaChart.svelte";
  import BarChart from "./_components/_charts/BarChart.svelte";
  import LineChart from "./_components/_charts/LineChart.svelte";
  import DonutChart from "./_components/_charts/DonutChart.svelte";
  import { trackAnalytics } from "$lib/common-library/integrations/analytics/analytics";

  let { children }: { children: Snippet } = $props();

  trackAnalytics();
</script>

<div class="flex flex-1 flex-col gap-4 p-4">
  <div class="grid auto-rows-max gap-4 md:grid-cols-3">
    <div class="bg-muted/50 aspect-video rounded-xl">
      <BarChart />
    </div>
    <div class="bg-muted/50 aspect-video rounded-xl">
      <LineChart />
    </div>
    <div class="bg-muted/50 aspect-video rounded-xl">
      <DonutChart />
    </div>
  </div>
  <div class="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min p-4">
    <AreaChart />
  </div>
</div>
