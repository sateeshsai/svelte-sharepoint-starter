<script lang="ts">
  import SearchForm from "./SearchForm.svelte";
  import VersionSwitcher from "./VersionSwitcher.svelte";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import type { ComponentProps } from "svelte";
  import { isActive, p, route } from "sv-router/generated";
  import { DASHBOARD_SAMPLE_DATA } from "./data.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import { cn } from "$lib/utils";
  import ErrorBoundaryMessage from "$lib/common-library/components/feedback/ErrorBoundaryMessage.svelte";

  const params = $derived(isActive("/admin/:category/:section") ? route.getParams("/admin/:category/:section") : null);
  const categorySlug = $derived(params ? params.section : null);

  let { ref = $bindable(null), ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();
  let searchTerm = $state("");
</script>

<svelte:boundary>
  {#snippet failed(error: any, reset)}
    <ErrorBoundaryMessage customError="Error rendering Admin side bar." {error} {reset} />
  {/snippet}

  <Sidebar.Root class="max-h-[calc(100dvh-44px-40px)] top-11 " {...restProps} bind:ref>
    <Sidebar.Header>
      <VersionSwitcher versions={DASHBOARD_SAMPLE_DATA.versions} defaultVersion={DASHBOARD_SAMPLE_DATA.versions[0]} />
      <Separator class="my-2" />
      <a href={p("/admin")} class={cn("text-left justify-start px-2 py-1 rounded-lg hover:bg-sidebar-accent", isActive("/admin") ? "bg-sidebar-accent" : null)}>Dashboard</a>
    </Sidebar.Header>
    <Separator class="my-2" />
    <Sidebar.Content>
      <p class="px-4 mt-2">Sample sections</p>
      <SearchForm bind:value={searchTerm} />
      <!-- We create a Sidebar.Group for each parent. -->
      {#each DASHBOARD_SAMPLE_DATA.navMain.filter((category) => category.items.reduce((acc, item) => (item.title
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ? true : acc), false)) as group (group.title)}
        <Sidebar.Group>
          <Sidebar.GroupLabel>
            <a href={p("/admin/:category", { params: { category: group.title.toLowerCase().replaceAll(" ", "-") } })}>{group.title}</a>
          </Sidebar.GroupLabel>
          <Sidebar.GroupContent>
            <Sidebar.Menu>
              {#each group.items.filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase())) as item (item.title)}
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton isActive={item.title.toLowerCase().replaceAll(" ", "-") === categorySlug}>
                    {#snippet child({ props })}
                      <a
                        href={p("/admin/:category/:section", {
                          params: {
                            category: group.title.toLowerCase().replaceAll(" ", "-"),
                            section: item.title.toLowerCase().replaceAll(" ", "-"),
                          },
                        })}
                        {...props}>{item.title}</a
                      >
                    {/snippet}
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
              {/each}
            </Sidebar.Menu>
          </Sidebar.GroupContent>
        </Sidebar.Group>
      {/each}
    </Sidebar.Content>
    <Sidebar.Rail />
  </Sidebar.Root>
</svelte:boundary>
