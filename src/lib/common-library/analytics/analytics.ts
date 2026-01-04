import { randomIdString } from "../functions/string";
import { SHAREPOINT_ENV } from "$lib/env/env";
import { postListItem } from "../sharepoint-rest-api/post/postListItem";
import type { AnalyticsEntry_ListItem_Post } from "./types";
import { AnalyticsEntryPostSchema } from "./schemas";
import { getFormDigestValue } from "../sharepoint-rest-api/get/getFormDigestValue";
import { updateListItem } from "../sharepoint-rest-api/update/updateListItem";
import { onMount } from "svelte";

let sessionId = randomIdString();

//USAGE
//Just call the trackAnalytics() at the top level in your component
//Each Entry's Created will be the page visit start and Modified will be leaving the page.
//Author is the user
//Pass any arbitrary data as stringified object to Data property - See usage example at the bottom

let postedAnalyticsEntryId: number;
let route: string;
export async function trackAnalytics(Data?: StringifiedObject) {
  async function postAnalyticsEntry() {
    let newAnalyticsEntry: AnalyticsEntry_ListItem_Post = {
      Title: SHAREPOINT_ENV.info.version,
      SessionId: sessionId,
      Route: window.location.hash,
      Data: stringifyKVObject(Data ?? {}),
    };
    const validationResult = AnalyticsEntryPostSchema.safeParse(newAnalyticsEntry);
    if (validationResult.success) {
      const postResponse = await postListItem({ listName: SHAREPOINT_ENV.lists.Analytics.name, dataToPost: newAnalyticsEntry });
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
  console.log(route, "END");
  //Not really updating any info. Updating only so that we can use the Modified property as user leaving a page.
  const postResponse = await updateListItem({
    listName: SHAREPOINT_ENV.lists.Analytics.name,
    itemId: postedAnalyticsEntryId,
    dataToUpdate: { Title: SHAREPOINT_ENV.info.version },
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
