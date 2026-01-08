<script lang="ts">
  import { getContext } from "svelte";
  import type { SharePointConfig } from "../sharepoint-rest-api/config";
  import { generateManifestData, type FixedWebAppManifest } from "./manifest";
  import PWA from "./PWA.svelte";

  const config = getContext<SharePointConfig>("sharePointConfig");
  const manifest: FixedWebAppManifest = generateManifestData(config);
</script>

<PWA {manifest} pagePath={config.paths.page} installDescription={config.pwa?.install_description} />
<svelte:head>
  <title>{manifest.name}</title>
  <link rel="icon" href="./assets/icons/favicon.svg" type="image/svg+xml" />
  <meta name="description" content={manifest.description} />
  <meta name="theme-color" content={manifest.theme_color} />
  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black" />
  <meta name="apple-mobile-web-app-title" content={manifest.name} />
  <link rel="icon" href={manifest.icons?.find((i) => i.sizes === "192x192")?.src} type="image/png" sizes="192x192" />
  <link rel="icon" href={manifest.icons?.find((i) => i.sizes === "512x512")?.src} type="image/png" sizes="512x512" />
  <link rel="apple-touch-icon" href={manifest.icons?.find((i) => i.sizes === "180x180")?.src} />
  <link crossorigin="use-credentials" rel="manifest" href={"data:application/manifest+json," + encodeURIComponent(JSON.stringify(manifest))} />
</svelte:head>
