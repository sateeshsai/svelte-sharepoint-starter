import { SHAREPOINT_ENV } from "$lib/env/env";
import { LOCAL_MODE } from "../../../utils/local-dev/modes";
import { RECOMMENDED_ERROR_ACTIONS_FOR_UI } from "../const";
import type { Sharepoint_Error, Sharepoint_Error_Formatted, Sharepoint_FormDigestResponse } from "../types";

export async function getFormDigestValue(options?: { siteCollectionUrl?: string; logToConsole?: boolean }): Promise<string | Sharepoint_Error_Formatted> {
  const request = new Request(`${options?.siteCollectionUrl ?? SHAREPOINT_ENV.paths.site_collection}/_api/contextinfo`, {
    method: "POST",
    credentials: "same-origin", // or credentials: 'include'
    headers: new Headers({
      Accept: "application/json; odata=verbose",
    }),
  });

  if (LOCAL_MODE) {
    return new Promise((res, rej) => {
      setTimeout(() => res(""), 200);
    });
  }

  return fetch(request)
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
      return {
        error: "Unable to fetch login credentials. Error message: " + (error?.["odata.error"]?.message?.value ?? "Something went wrong. ") + RECOMMENDED_ERROR_ACTIONS_FOR_UI.reload,
      };
    });
}
