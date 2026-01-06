import { randomIdString } from "../../utils/functions/string";
import { postListItem } from "../sharepoint-rest-api/rest-functions/post/postListItem";
import type { AnalyticsEntry_ListItem_Post } from "./types";
import type { SharePointConfig } from "../sharepoint-rest-api/config";
import { AnalyticsEntryPostSchema } from "./schemas";
import { updateListItem } from "../sharepoint-rest-api/rest-functions/update/updateListItem";
import { onMount } from "svelte";
import { getContext } from "svelte";
import { LOCAL_MODE } from "../../utils/local-dev/modes";

let sessionId = randomIdString();

//USAGE
//Just call the trackAnalytics() at the top level in your component
//Each Entry's Created will be the page visit start and Modified will be leaving the page.
//Author is the user
//Pass any arbitrary data as stringified object to Data property - See usage example at the bottom

let postedAnalyticsEntryId: number;
let route: string;
let cachedConfig: SharePointConfig;

export async function trackAnalytics(Data?: StringifiedObject) {
  if (LOCAL_MODE) return; // Skip analytics in local development mode

  cachedConfig = cachedConfig ?? getContext<SharePointConfig>("sharePointConfig");
  const config = cachedConfig;
  async function postAnalyticsEntry() {
    let newAnalyticsEntry: AnalyticsEntry_ListItem_Post = {
      Title: config.info.version,
      SessionId: sessionId,
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
      postedAnalyticsEntryId = postResponse.Id;
      route = window.location.hash;
    }
  }

  onMount(() => {
    console.log(window.location.hash, "START");
    postAnalyticsEntry();
    return () => untrackAnalytics();
  });
}

export async function untrackAnalytics() {
  if (LOCAL_MODE || !postedAnalyticsEntryId) return; // Skip analytics in local development mode

  const config = cachedConfig;
  console.log(route, "END");
  //Not really updating any info. Updating only so that we can use the Modified property as user leaving a page.
  const postResponse = await updateListItem({
    listName: config.lists.Analytics.name,
    itemId: postedAnalyticsEntryId,
    dataToUpdate: { Title: config.info.version },
  });

  if ("error" in postResponse) {
    console.log("Error updating Analytics entry.", postedAnalyticsEntryId, postResponse);
  }
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
