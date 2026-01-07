<script lang="ts">
  import "@khmyznikov/pwa-install";
  import { getContext, onMount } from "svelte";
  import type { SharePointConfig } from "../sharepoint-rest-api/config";
  //@ts-ignore
  // import System from "svelte-system-info";
  import { MANIFEST_DATA } from "./manifest";
  import { LOCAL_MODE } from "$lib/common-library/utils/local-dev/modes";

  const config = getContext<SharePointConfig>("sharePointConfig");
  const siteRootPath = config.paths.page;

  if ("serviceWorker" in navigator) {
    if (navigator.serviceWorker.controller) {
      // console.log("Active service worker found, no need to register");
    } else {
      navigator.serviceWorker.register(siteRootPath + "service-worker.js", { scope: siteRootPath }).then(function (reg) {
        console.log(reg, "Service worker registered");
      });
    }
  }

  const handlePWAEvent = (message: any) => {
    // console.log(message);
  };

  const INSTALL_DESCRIPTION = "Install this as an app on your device for easy access.";

  onMount(() => {
    var pwaInstall: any = document.getElementById("pwa-install");
    pwaInstall.setAttribute("name", MANIFEST_DATA.name);
    pwaInstall.setAttribute("description", MANIFEST_DATA.description);
    pwaInstall.setAttribute("install-description", INSTALL_DESCRIPTION);

    const forceStyle = (style: string) => {
      switch (style) {
        case "apple-mobile":
          pwaInstall.isAppleDesktopPlatform = false;
          pwaInstall.isAppleMobilePlatform = true;
          break;
        case "apple-desktop":
          pwaInstall.isAppleMobilePlatform = false;
          pwaInstall.isAppleDesktopPlatform = true;
          break;
        case "chrome":
          pwaInstall.isAppleMobilePlatform = false;
          pwaInstall.isAppleDesktopPlatform = false;
          break;
      }
      pwaInstall.hideDialog();
      if (!LOCAL_MODE) pwaInstall.showDialog();
    };

    //TODO: VERIFY - DEVICE SPECIFIC STYLES
    // forceStyle(System.OSName === "macOS" ? "apple-desktop" : System.OSName === "iOS" ? "apple-mobile" : "chrome");

    //EVENTS
    pwaInstall.addEventListener("pwa-install-success-event", (event: any) => {
      handlePWAEvent(event.detail.message);
    });
    pwaInstall.addEventListener("pwa-install-fail-event", (event: any) => {
      handlePWAEvent(event.detail.message);
    });
    pwaInstall.addEventListener("pwa-user-choice-result-event", (event: any) => {
      handlePWAEvent(event.detail.message);
    });
    pwaInstall.addEventListener("pwa-install-available-event", (event: any) => {
      handlePWAEvent(event.detail.message);
    });
    pwaInstall.addEventListener("pwa-install-how-to-event", (event: any) => {
      handlePWAEvent(event.detail.message);
    });
    pwaInstall.addEventListener("pwa-install-gallery-event", (event: any) => {
      handlePWAEvent(event.detail.message);
    });
  });
</script>

<pwa-install icon={MANIFEST_DATA.icons && MANIFEST_DATA.icons[0].src} id="pwa-install"> </pwa-install>
