<script>
  import { p, route } from "sv-router/generated";
  import { DASHBOARD_SAMPLE_DATA } from "../_components/data.svelte";
  import StatusMessage from "$lib/common-library/components/feedback/StatusMessage.svelte";
  import { trackAnalytics } from "$lib/common-library/integrations/analytics/analytics";
  import { Section, SectionHeader } from "$lib/common-library/components/layout";
  const params = $derived(route.getParams("/admin/:category"));
  const categorySlug = $derived(params.category);
  const categoryData = $derived(DASHBOARD_SAMPLE_DATA.navMain.find((c) => c.title.toLowerCase().replaceAll(" ", "-") === categorySlug));

  trackAnalytics();
</script>

{#if categoryData}
  <Section padding="compact" prose="standard">
    <SectionHeader variant="page" breadcrumbs={[{ label: "Admin", href: "#/admin" }, { label: categoryData.title }]}>
      {#snippet intro()}
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iusto, officiis cumque. Expedita aliquid cumque illo placeat sapiente, amet nihil numquam! Fugit neque non accusantium distinctio
          cumque dolore modi soluta pariatur.
        </p>
      {/snippet}
      {categoryData?.title}
    </SectionHeader>
    <article class="">
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
  </Section>
{:else}
  <StatusMessage type="error" message={"No category found: " + categorySlug} />
{/if}
