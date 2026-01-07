import { getContext } from "svelte";
import type { SharePointConfig } from "../sharepoint-rest-api/config";
import type { WebAppManifest } from "web-app-manifest";

type DisplayOverride = "browser" | "fullscreen" | "minimal-ui" | "standalone" | "tabbed" | "window-controls-overlay";
interface FixedWebAppManifest extends WebAppManifest {
  display_override: DisplayOverride[];
  // screenshots: { src: string; sizes: string; form_factor?: string }[];
}

/**
 * Generate PWA manifest data from config
 * Uses getContext to access app-specific SharePoint config
 */
function generateManifestData(assetsPath: string): FixedWebAppManifest {
  return {
    name: "Sveltekit + SharePoint starter",
    short_name: "Starter",
    start_url: window.location.href.split("#")?.[0],
    description: "A batteries-included starter project.",
    theme_color: "black",
    background_color: "black",
    display: "standalone",
    display_override: ["fullscreen"],
    icons: [
      // Generate the following maskable icons and JSON here: https://maskable.app/editor
      //Learn more about maskable icons for PWA here: https://web.dev/articles/maskable-icon
      {
        purpose: "maskable",
        sizes: "1024x1024",
        src: assetsPath + "icons/" + "maskable_icon.png",
        type: "image/png",
      },
      {
        purpose: "maskable",
        sizes: "48x48",
        src: assetsPath + "icons/" + "maskable_icon_x48.png",
        type: "image/png",
      },
      {
        purpose: "maskable",
        sizes: "72x72",
        src: assetsPath + "icons/" + "maskable_icon_x72.png",
        type: "image/png",
      },
      {
        purpose: "maskable",
        sizes: "96x96",
        src: assetsPath + "icons/" + "maskable_icon_x96.png",
        type: "image/png",
      },
      {
        purpose: "maskable",
        sizes: "128x128",
        src: assetsPath + "icons/" + "maskable_icon_x128.png",
        type: "image/png",
      },
      {
        purpose: "maskable",
        sizes: "192x192",
        src: assetsPath + "icons/" + "maskable_icon_x192.png",
        type: "image/png",
      },
      {
        purpose: "maskable",
        sizes: "384x384",
        src: assetsPath + "icons/" + "maskable_icon_x384.png",
        type: "image/png",
      },
      {
        purpose: "maskable",
        sizes: "512x512",
        src: assetsPath + "icons/" + "maskable_icon_x512.png",
        type: "image/png",
      },

      // Resize on the above variants and add the following two variants manually
      {
        purpose: "maskable",
        sizes: "180x180",
        src: assetsPath + "icons/" + "maskable_icon_x180.png",
        type: "image/png",
      },
      {
        purpose: "maskable",
        sizes: "64x64",
        src: assetsPath + "icons/" + "maskable_icon_x64.png",
        type: "image/png",
      },
      // Create this manually too. Unlike the above, no padding required - just transparent png, like favicon
      {
        purpose: "any",
        sizes: "512x512",
        src: assetsPath + "icons/" + "x512.png",
        type: "image/png",
      },
    ],
    screenshots: [
      { src: assetsPath + "screenshots/" + "551x979-1.png", sizes: "551x979" },
      { src: assetsPath + "screenshots/" + "2000x1073-1.png", sizes: "2000x1073", form_factor: "wide" },
    ],
  };
}

// Lazy-loaded manifest data from context
let cachedManifest: FixedWebAppManifest | null = null;

/**
 * Get manifest data - lazily loads from context on first access
 * Must be called from within a component context
 */
function getManifestData(): FixedWebAppManifest {
  if (!cachedManifest) {
    const config = getContext<SharePointConfig>("sharePointConfig");
    cachedManifest = generateManifestData(config.paths.assets);
  }
  return cachedManifest;
}

// Proxy to make it work like the old const but loads lazily
export const MANIFEST_DATA = new Proxy({} as FixedWebAppManifest, {
  get(_target, prop) {
    return getManifestData()[prop as keyof FixedWebAppManifest];
  },
});

// console.log(MANIFEST_DATA);
