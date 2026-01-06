import { SHAREPOINT_CONFIG } from "$lib/env/sharepoint-config";
import { RECOMMENDED_ERROR_ACTIONS_FOR_UI } from "../const";
import { deduplicate } from "../helpers/deduplication";
import type { Sharepoint_Error, Sharepoint_Error_Formatted, Sharepoint_FormDigestResponse } from "../types";

export async function getFormDigestValue(options?: {
  siteCollectionUrl?: string;
  logToConsole?: boolean;
  signal?: AbortSignal;
  deduplicationTtlMs?: number;
}): Promise<string | Sharepoint_Error_Formatted> {
  const requestURL = `${options?.siteCollectionUrl ?? SHAREPOINT_CONFIG.paths.site_collection}/_api/contextinfo`;

  const request = new Request(requestURL, {
    method: "POST",
    credentials: "same-origin", // or credentials: 'include'
    headers: new Headers({
      Accept: "application/json; odata=verbose",
    }),
  });

  return deduplicate(
    requestURL,
    () =>
      fetch(request, { signal: options?.signal ?? null })
        .then((response) => response.json())
        .then((data: Sharepoint_FormDigestResponse | Sharepoint_Error | undefined) => {
          if (options?.logToConsole) console.log("FN: getFormDigestValue Response", data);
          if (!data || "odata.error" in data) {
            return {
              error: "Unable to fetch login credentials. Error message: " + (data?.["odata.error"].message.value ?? "Something went wrong. ") + RECOMMENDED_ERROR_ACTIONS_FOR_UI.reload,
            };
          }
          return data.d.GetContextWebInformation.FormDigestValue;
        })
        .catch((error) => {
          if (options?.logToConsole) console.log("FN: getFormDigestValue Error", error);
          if (error instanceof Error && error.name === "AbortError") {
            return {
              error: "Unable to fetch login credentials. Request timed out or was cancelled. " + RECOMMENDED_ERROR_ACTIONS_FOR_UI.reload,
            };
          }
          return {
            error: "Unable to fetch login credentials. Network error occurred. " + RECOMMENDED_ERROR_ACTIONS_FOR_UI.reload,
          };
        }),
    {
      ttlMs: options?.deduplicationTtlMs ?? 30000, // 30 second default TTL for form digest
      clearOnError: true,
    }
  );
}
