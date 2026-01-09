<script>
  import TextAlignJustify from "@lucide/svelte/icons/text-align-justify";
  import { SHAREPOINT_CONFIG } from "$lib/env/sharepoint-config";
  import DeloitteLogo from "$lib/common-library/components/branding/DeloitteLogo.svelte";
  import * as Sheet from "$lib/components/ui/sheet/index.js";
  import NavItems from "./_components/NavItems.svelte";

  let sheetIsOpen = $state(false);
</script>

<header class="flex h-11 w-full items-center justify-between px-6 shadow md:px-8 sticky top-0 bg-background/50 backdrop-blur-md border-b z-100">
  <a class="logo" href={SHAREPOINT_CONFIG.paths.page + "#/"}>
    <DeloitteLogo />
  </a>
  <nav class="">
    <Sheet.Root bind:open={sheetIsOpen}>
      <Sheet.Trigger class="block py-2 lg:hidden"><TextAlignJustify class="text-muted-foreground" /></Sheet.Trigger>
      <Sheet.Content class="grid content-end px-8 pb-16">
        <Sheet.Header class="py-0">
          <Sheet.Title class="text-lg text-muted-foreground">Navigation menu</Sheet.Title>
          <!-- <Sheet.Description>
					    </Sheet.Description> -->
        </Sheet.Header>
        <NavItems bind:sheetIsOpen />
      </Sheet.Content>
    </Sheet.Root>
    <div class="hidden lg:block"><NavItems {sheetIsOpen} /></div>
  </nav>
</header>
