<script>
  import { SHAREPOINT_CONFIG } from "$lib/env/sharepoint-config";
  import { MANIFEST_DATA } from "./manifest";
  import PWA from "./PWA.svelte";
</script>

<PWA />
<svelte:head>
  <title>{MANIFEST_DATA?.name}</title>
  <link rel="icon" href="./assets/icons/favicon.svg" type="image/svg+xml" />
  <meta name="description" content={MANIFEST_DATA?.description} />
  <meta name="theme-color" content={MANIFEST_DATA?.theme_color} />
  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black" />
  <meta name="apple-mobile-web-app-title" content={MANIFEST_DATA?.name} />
  <link rel="icon" href={MANIFEST_DATA?.icons && MANIFEST_DATA?.icons.find((i) => i.sizes === "192x192")?.src} type="image/png" sizes="192x192" />
  <link rel="icon" href={MANIFEST_DATA?.icons && MANIFEST_DATA?.icons.find((i) => i.sizes === "512x512")?.src} type="image/png" sizes="512x512" />
  <link rel="apple-touch-icon" href={MANIFEST_DATA?.icons && MANIFEST_DATA?.icons.find((i) => i.sizes === "180x180")?.src} />
  <link crossorigin="use-credentials" rel="manifest" href={"data:application/manifest+json," + encodeURIComponent(JSON.stringify(MANIFEST_DATA))} />
</svelte:head>
