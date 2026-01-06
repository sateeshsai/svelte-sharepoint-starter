import { LOCAL_MODE } from "$lib/common-library/utils/local-dev/modes";
import { SHAREPOINT_CONFIG } from "$lib/env/sharepoint-config";
import { RECOMMENDED_ERROR_ACTIONS_FOR_UI } from "../const";
import { deduplicate } from "../helpers/deduplication";
import type { Sharepoint_Error, Sharepoint_Error_Formatted, Sharepoint_User } from "../types";

export function getCurrentUser<T extends Sharepoint_User>(options: {
  siteCollectionUrl?: string;
  logToConsole?: boolean;
  dataToReturnInLocalMode: T;
  signal?: AbortSignal;
  deduplicationTtlMs?: number;
}): Promise<T | Sharepoint_Error_Formatted> {
  if (LOCAL_MODE) {
    return new Promise((res, rej) => {
      setTimeout(() => {
        res(options.dataToReturnInLocalMode);
      }, 400);
    });
  }

  const requestURL = `${options.siteCollectionUrl ?? SHAREPOINT_CONFIG.paths.site_collection}/_api/web/currentuser`;

  if (options.logToConsole) console.log(requestURL);

  const fetchRequest = new Request(requestURL, {
    method: "GET",
    mode: "no-cors",
    credentials: "same-origin", // or credentials: 'include'
    headers: new Headers({
      Accept: "application/json;odata=nometadata",
      useCredentials: "true",
    }),
  });

  return deduplicate(
    requestURL,
    () =>
      fetch(fetchRequest, { signal: options.signal ?? null })
        .then((response) => response.json())
        .then((data: T | Sharepoint_Error | undefined) => {
          if (options.logToConsole) console.log("FN: getCurrentUser Response", data);
          if (!data || "odata.error" in data) {
            return {
              error: "Unable to fetch current user details. Error message: " + (data?.["odata.error"].message.value ?? "Something went wrong. ") + RECOMMENDED_ERROR_ACTIONS_FOR_UI.reload,
            };
          }
          return data;
        })
        .catch((error) => {
          if (options.logToConsole) console.log("FN: getCurrentUser Error", error);
          if (error instanceof Error && error.name === "AbortError") {
            return {
              error: "Unable to fetch current user details. Request timed out or was cancelled. " + RECOMMENDED_ERROR_ACTIONS_FOR_UI.reload,
            };
          }
          return {
            error: "Unable to fetch current user details. Network error occurred. " + RECOMMENDED_ERROR_ACTIONS_FOR_UI.reload,
          };
        }),
    {
      ttlMs: options.deduplicationTtlMs ?? 60000, // 60 second default TTL for user data
      clearOnError: true,
    }
  );
}
