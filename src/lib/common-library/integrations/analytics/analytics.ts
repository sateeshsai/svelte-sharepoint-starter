import { randomIdString } from "../../utils/functions/string";
import { postListItem } from "../sharepoint-rest-api/rest-functions/post/postListItem";
import type { AnalyticsEntry_ListItem_Post } from "./types";
import type { SharePointConfig } from "../sharepoint-rest-api/config";
import { AnalyticsEntryPostSchema } from "./schemas";
import { updateListItem } from "../sharepoint-rest-api/rest-functions/update/updateListItem";
import { onMount } from "svelte";
import { getContext } from "svelte";
import { LOCAL_MODE } from "../../utils/local-dev/modes";

// Module-level: shared across all components in the browser session
let sessionId = randomIdString();

/**
 * Track analytics for a component/page
 * Creates an entry when component mounts and updates it when unmounting
 * Each component that calls this gets its own independent tracking state
 *
 * USAGE:
 * Call trackAnalytics() at the top level in your component (only on routes you want to track)
 * Each Entry's Created = page visit start, Modified = page leave time
 *
 * @param Data - Optional stringified object with arbitrary tracking data
 * @example
 * trackAnalytics(); // Basic tracking
 * trackAnalytics(stringifyKVObject({ userId: "123", action: "view" })); // With data
 */
export async function trackAnalytics(Data?: StringifiedObject) {
  if (LOCAL_MODE) return; // Skip analytics in local development mode

  // Per-component closure state - each component gets its own
  const config = getContext<SharePointConfig>("sharePointConfig");
  let postedAnalyticsEntryId: number | undefined;
  let route: string;

  async function postAnalyticsEntry() {
    const newAnalyticsEntry: AnalyticsEntry_ListItem_Post = {
      Title: config.info.version,
      SessionId: sessionId, // Shared across session
      Route: window.location.hash,
      Data: stringifyKVObject(Data ?? {}),
    };

    const validationResult = AnalyticsEntryPostSchema.safeParse(newAnalyticsEntry);
    if (validationResult.success) {
      const postResponse = await postListItem({ listName: config.lists.Analytics.name, dataToPost: newAnalyticsEntry });
      if ("error" in postResponse) {
        console.log("Error posting Analytics entry.", postResponse);
        return;
      }
      postedAnalyticsEntryId = postResponse.Id; // Store THIS component's entry ID
      route = window.location.hash;
    }
  }

  async function cleanup() {
    if (!postedAnalyticsEntryId) return; // No entry to update

    console.log(route, "END");
    // Update entry to mark leave time (uses Modified timestamp)
    const postResponse = await updateListItem({
      listName: config.lists.Analytics.name,
      itemId: postedAnalyticsEntryId,
      dataToUpdate: { Title: config.info.version },
    });

    if ("error" in postResponse) {
      console.log("Error updating Analytics entry.", postedAnalyticsEntryId, postResponse);
    }
  }

  onMount(() => {
    console.log(window.location.hash, "START");
    postAnalyticsEntry();
    return cleanup;
  });
}

type StringifiedObject = string & { readonly __stringifiedObject: true };

export function stringifyKVObject(obj: Record<string, any>): StringifiedObject {
  return JSON.stringify(obj) as StringifiedObject;
}
export function parseStringifiedKV(data: StringifiedObject): Record<string, any> {
  return JSON.parse(data);
}

// let sampleEntry: AnalyticsEntry = {
//   SiteVersion: "VERSION X",
//   SessionId: randomIdString(),
//   Route: "/",
//   Data: stringifyKVObject({ userId: "123", action: "click", nested: { Id: 1, Title: "Some nested data" } }),
// };

// const sample_ParsedUserId = parseStringifiedKV(sampleEntry.Data).userId;
// const sample_ParsedNestedData = parseStringifiedKV(sampleEntry.Data).nested.Title;
