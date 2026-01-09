<script lang="ts">
  import { SHAREPOINT_CONFIG } from "$lib/env/sharepoint-config";
  import { NAVIGATION_MENU_ITEMS } from "./navigation";
  import { getPictureUrl, getUserFirstLastNames } from "$lib/common-library/integrations/sharepoint-rest-api/utilities/helpers";
  let { sheetIsOpen = $bindable() }: { sheetIsOpen: boolean } = $props();
  import * as Avatar from "$lib/components/ui/avatar/index.js";
  import LightDarkIcon from "$lib/common-library/components/icons/LightDarkIcon.svelte";
  import { toggleMode } from "mode-watcher";
  import { global_State } from "$lib/data/global-state.svelte";
  import { isActiveLink } from "sv-router";
  import { cn } from "$lib/utils";

  const ACTIVE_LINK_CLASSES = "text-dblue-400 dark:text-dblue-300 font-bold transition-all";
</script>

<nav class="px-4 py-3">
  <ul class="flex flex-col gap-8 lg:gap-4 lg:flex-row lg:items-center">
    {#each NAVIGATION_MENU_ITEMS as menuItem}
      {#if menuItem.accessRole !== "Admin" || global_State.accessRole === "Admin"}
        <li>
          <a onclick={() => (sheetIsOpen = false)} class={cn("w-full md:text-sm")} use:isActiveLink={{ className: ACTIVE_LINK_CLASSES }} href={SHAREPOINT_CONFIG.paths.page + "#" + menuItem.route}>
            {menuItem.name}
          </a>
        </li>
      {/if}
    {/each}
    {#if global_State.userProperties}
      {@const userNames = getUserFirstLastNames(global_State.userProperties)}
      <Avatar.Root class="h-6 w-6 rounded text-xs hidden lg:block">
        <Avatar.Image class="rounded" src={getPictureUrl(global_State.userProperties.Email)} alt={global_State.userProperties.Email} />
        <Avatar.Fallback class="rounded bg-gray-300 dark:bg-gray-600">{userNames.last.charAt(0)}{userNames.first.charAt(0)}</Avatar.Fallback>
      </Avatar.Root>
    {/if}

    <button onclick={toggleMode} class="flex items-center gap-2">
      <LightDarkIcon />
      <span class="lg:sr-only">Toggle theme</span>
    </button>
  </ul>
</nav>
