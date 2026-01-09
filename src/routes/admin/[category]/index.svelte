<script>
  import { PAGE_UTIL_CLASSES } from "$lib/common-library/utils/const/classes";
  import { cn } from "$lib/utils";
  import { p, route } from "sv-router/generated";
  import { DASHBOARD_SAMPLE_DATA } from "../_components/data.svelte";
  import StatusMessage from "$lib/common-library/components/feedback/StatusMessage.svelte";
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
  import { trackAnalytics } from "$lib/common-library/integrations/analytics/analytics";
  const params = $derived(route.getParams("/admin/:category"));
  const categorySlug = $derived(params.category);
  const categoryData = $derived(DASHBOARD_SAMPLE_DATA.navMain.find((c) => c.title.toLowerCase().replaceAll(" ", "-") === categorySlug));

  trackAnalytics();
</script>

{#if categoryData}
  <section class={cn("p-8")}>
    <Breadcrumb.Root>
      <Breadcrumb.List class="p-0 ">
        <Breadcrumb.Item class="pl-0">
          <Breadcrumb.Link href="/">Admin</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.Page>{categoryData.title}</Breadcrumb.Page>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb.Root>
    <article class="prose-sm mt-8">
      <h1 class="">{categoryData?.title}</h1>
      <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iusto, officiis cumque. Expedita aliquid cumque illo placeat sapiente, amet nihil numquam! Fugit neque non accusantium distinctio
        cumque dolore modi soluta pariatur.
      </p>
      <ul class="list-disc -ml-2">
        {#each categoryData.items as section}
          <li>
            <a
              class="underline underline-offset-2"
              href={p("/admin/:category/:section", {
                params: {
                  category: categorySlug,
                  section: section.title.toLowerCase().replaceAll(" ", "-"),
                },
              })}>{section.title}</a
            >
          </li>
        {/each}
      </ul>
    </article>
  </section>
{:else}
  <StatusMessage type="error" message={"No category found: " + categorySlug} />
{/if}
