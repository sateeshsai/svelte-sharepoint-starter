<script lang="ts">
  import "@khmyznikov/pwa-install";
  import { onMount } from "svelte";
  import type { FixedWebAppManifest } from "./manifest";
  import { LOCAL_MODE } from "$lib/common-library/utils/local-dev/modes";

  interface Props {
    manifest: FixedWebAppManifest;
    pagePath: string;
    installDescription?: string;
  }

  const { manifest, pagePath, installDescription }: Props = $props();

  const DEFAULT_INSTALL_DESCRIPTION = "Install this as an app on your device for easy access.";

  onMount(() => {
    // Register service worker (browser-only)
    if ("serviceWorker" in navigator && !navigator.serviceWorker.controller) {
      navigator.serviceWorker
        .register(pagePath + "service-worker.js", { scope: pagePath })
        .then((reg) => console.log("Service worker registered", reg))
        .catch((err) => console.warn("Service worker registration failed", err));
    }

    // Setup PWA install component
    const pwaInstall = document.getElementById("pwa-install") as HTMLElement & {
      hideDialog: () => void;
      showDialog: () => void;
    };

    if (!pwaInstall) return;

    pwaInstall.setAttribute("name", manifest.name ?? "");
    pwaInstall.setAttribute("description", manifest.description ?? "");
    pwaInstall.setAttribute("install-description", installDescription ?? DEFAULT_INSTALL_DESCRIPTION);

    if (!LOCAL_MODE) {
      pwaInstall.showDialog();
    }
  });
</script>

<pwa-install icon={manifest.icons?.[0]?.src} id="pwa-install"></pwa-install>
