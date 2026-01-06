import { SHAREPOINT_CONFIG } from "$lib/env/sharepoint-config";
import { RECOMMENDED_ERROR_ACTIONS_FOR_UI } from "../../constants/const";
import { deduplicate } from "../helpers/deduplication";
import type { Sharepoint_Error, Sharepoint_Error_Formatted, Sharepoint_Get_Operations } from "../../data/types";

export function getListItems<T extends { value: Record<string, any> }>(options: {
  siteCollectionUrl?: string;
  listName: string;
  operations?: Sharepoint_Get_Operations;
  logToConsole?: boolean;
  signal?: AbortSignal; // Optional abort signal for request cancellation
  deduplicationTtlMs?: number; // Optional TTL for deduplication cache (default: 30s)
}): Promise<T | Sharepoint_Error_Formatted> {
  let queryString = "?";

  const operations = options.operations;
  if (typeof operations === "string") {
  } else {
    operations?.forEach(([operation, value], idx) => {
      if (value) {
        queryString += "$" + operation + "=" + value + (idx !== operations.length - 1 ? "&" : "");
      }
    });
  }

  const requestURL = `${options.siteCollectionUrl ?? SHAREPOINT_CONFIG.paths.site_collection}/_api/web/lists/GetByTitle('${options.listName}')/items${queryString}`;
  if (options.logToConsole) console.log(requestURL);
  const fetchRequest = new Request(requestURL, {
    method: "GET",
    mode: "no-cors",
    credentials: "same-origin", // or credentials: 'include'
    headers: new Headers({
      // Accept: 'application/json; odata=verbose',
      Accept: "application/json;odata=nometadata",
      useCredentials: "true",
    }),
  });

  // Use actual request URL as cache key - includes siteCollectionUrl, listName, and all operations
  return deduplicate(
    requestURL,
    () =>
      fetch(fetchRequest, { signal: options.signal ?? null })
        .then((response) => response.json())
        .then((data: T | Sharepoint_Error | undefined) => {
          if (options.logToConsole) console.log("FN: getListItems Response", data);
          if (!data || "odata.error" in data) {
            return {
              error: "Error message: " + (data?.["odata.error"].message.value ?? "Something went wrong. ") + RECOMMENDED_ERROR_ACTIONS_FOR_UI.reload,
            };
          }
          return data;
        })
        .catch((error) => {
          if (options.logToConsole) console.log("FN: getListItems Error", error);
          if (error instanceof Error && error.name === "AbortError") {
            return {
              error: "Request timed out or was cancelled. " + RECOMMENDED_ERROR_ACTIONS_FOR_UI.reload,
            };
          }
          return {
            error: "Network error occurred. " + RECOMMENDED_ERROR_ACTIONS_FOR_UI.reload,
          };
        }),
    {
      ttlMs: options.deduplicationTtlMs ?? 30000, // 30 second default TTL
      clearOnError: true, // Clear cache on error to allow retries
    }
  );
}
