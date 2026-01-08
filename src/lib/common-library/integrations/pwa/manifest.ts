import type { WebAppManifest } from "web-app-manifest";
import type { SharePointConfig } from "../sharepoint-rest-api/config";

type DisplayOverride = "browser" | "fullscreen" | "minimal-ui" | "standalone" | "tabbed" | "window-controls-overlay";

export interface FixedWebAppManifest extends WebAppManifest {
  display_override: DisplayOverride[];
}

/**
 * Standard PWA icon sizes following maskable icon conventions
 * Generate icons at https://maskable.app/editor
 * See https://web.dev/articles/maskable-icon
 */
function getDefaultIcons(assetsPath: string): WebAppManifest["icons"] {
  const sizes = ["1024x1024", "48x48", "72x72", "96x96", "128x128", "192x192", "384x384", "512x512", "180x180", "64x64"];
  const maskableIcons = sizes.map((size) => ({
    purpose: "maskable" as const,
    sizes: size,
    src: `${assetsPath}icons/maskable_icon${size === "1024x1024" ? "" : "_x" + size.split("x")[0]}.png`,
    type: "image/png",
  }));

  return [...maskableIcons, { purpose: "any", sizes: "512x512", src: `${assetsPath}icons/x512.png`, type: "image/png" }];
}

/**
 * Generate PWA manifest from SharePoint config
 * Uses config.pwa for app-specific branding, config.paths.assets for icon paths
 */
export function generateManifestData(config: SharePointConfig): FixedWebAppManifest {
  const pwa = config.pwa;
  if (!pwa) {
    throw new Error("PWA config missing from SharePointConfig. Add pwa: { name, short_name, description } to your config.");
  }

  return {
    name: pwa.name,
    short_name: pwa.short_name,
    description: pwa.description,
    start_url: window.location.href.split("#")?.[0],
    theme_color: pwa.theme_color ?? "black",
    background_color: pwa.background_color ?? "black",
    display: "standalone",
    display_override: ["fullscreen"],
    icons: pwa.icons ?? getDefaultIcons(config.paths.assets),
    screenshots: (pwa.screenshots ?? []) as WebAppManifest["screenshots"],
  };
}
