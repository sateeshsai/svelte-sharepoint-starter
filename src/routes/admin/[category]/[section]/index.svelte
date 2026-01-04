<script>
  import StatusMessage from "$lib/common-library/utils/components/ui-utils/StatusMessage.svelte";
  import { cn } from "$lib/utils";
  import { DASHBOARD_SAMPLE_DATA } from "$routes/admin/_components/data.svelte";
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";

  import { route } from "sv-router/generated";
  import { trackAnalytics } from "$lib/common-library/integrations/analytics/analytics";
  const params = $derived(route.getParams("/admin/:category/:section"));
  const categorySlug = $derived(params.category);
  const sectionSlug = $derived(params.section);

  const categoryData = $derived(DASHBOARD_SAMPLE_DATA.navMain.find((c) => c.title.toLowerCase().replaceAll(" ", "-") === categorySlug));
  const sectionData = $derived(categoryData?.items.find((c) => c.title.toLowerCase().replaceAll(" ", "-") === sectionSlug));

  trackAnalytics();
</script>

{#if sectionData}
  <section class={cn("p-8")}>
    <Breadcrumb.Root>
      <Breadcrumb.List class="p-0">
        <Breadcrumb.Item class="pl-0">
          <Breadcrumb.Link href="/">Admin</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.Link href="/components">{categoryData?.title}</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.Page>{sectionData.title}</Breadcrumb.Page>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb.Root>
    <article class="prose-sm mt-8">
      <h1 class="">{sectionData?.title}</h1>
      <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iusto, officiis cumque. Expedita aliquid cumque illo placeat sapiente, amet nihil numquam! Fugit neque non accusantium distinctio
        cumque dolore modi soluta pariatur.
      </p>
    </article>
  </section>
{:else}
  <StatusMessage type="error" message={"No category found: " + categorySlug} />
{/if}
