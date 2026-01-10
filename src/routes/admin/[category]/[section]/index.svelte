<script>
  import StatusMessage from "$lib/common-library/components/feedback/StatusMessage.svelte";
  import { DASHBOARD_SAMPLE_DATA } from "$routes/admin/_components/data.svelte";

  import { route } from "sv-router/generated";
  import { trackAnalytics } from "$lib/common-library/integrations/analytics/analytics";
  import { Section, SectionHeader } from "$lib/common-library/components/layout";
  const params = $derived(route.getParams("/admin/:category/:section"));
  const categorySlug = $derived(params.category);
  const sectionSlug = $derived(params.section);

  const categoryData = $derived(DASHBOARD_SAMPLE_DATA.navMain.find((c) => c.title.toLowerCase().replaceAll(" ", "-") === categorySlug));
  const sectionData = $derived(categoryData?.items.find((c) => c.title.toLowerCase().replaceAll(" ", "-") === sectionSlug));

  trackAnalytics();
</script>

{#if sectionData}
  <Section padding="compact">
    <SectionHeader variant="page" breadcrumbs={[{ label: "Admin", href: "/" }, { label: categoryData?.title ?? "", href: "/components" }, { label: sectionData.title }]}>
      {#snippet intro()}
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iusto, officiis cumque. Expedita aliquid cumque illo placeat sapiente, amet nihil numquam! Fugit neque non accusantium distinctio
          cumque dolore modi soluta pariatur.
        </p>
      {/snippet}
      {sectionData?.title}
    </SectionHeader>
  </Section>
{:else}
  <StatusMessage type="error" message={"No category found: " + categorySlug} />
{/if}
