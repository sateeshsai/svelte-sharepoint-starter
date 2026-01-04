import { LOCAL_MODE } from "$lib/common-library/local-dev/modes";
import { SHAREPOINT_ENV } from "$lib/env/env";
import { RECOMMENDED_ERROR_ACTIONS_FOR_UI } from "../const";
import type { Sharepoint_Error, Sharepoint_Error_Formatted, Sharepoint_User_Properties } from "../types";

export function getCurrentUserProperties<T extends Sharepoint_User_Properties>(options: {
  siteCollectionUrl?: string;
  logToConsole?: boolean;
  dataToReturnInLocalMode: T;
}): Promise<T | Sharepoint_Error_Formatted> {
  if (LOCAL_MODE) {
    return new Promise((res, rej) => {
      setTimeout(() => {
        res(options.dataToReturnInLocalMode);
      }, 400);
    });
  }

  const requestURL = `${options.siteCollectionUrl ?? SHAREPOINT_ENV.paths.site_collection}/_api/SP.UserProfiles.PeopleManager/GetMyProperties`;

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

  return fetch(fetchRequest)
    .then((response) => response.json())
    .then((data: T | Sharepoint_Error | undefined) => {
      if (options.logToConsole) console.log("FN: getCurrentUserProperties Response", data);
      if (!data || "odata.error" in data) {
        return {
          error: "Unable to fetch current user properties. Error message: " + (data?.["odata.error"].message.value ?? "Something went wrong. ") + RECOMMENDED_ERROR_ACTIONS_FOR_UI.reload,
        };
      }
      return data;
    })
    .catch((error) => {
      if (options.logToConsole) console.log("FN: getCurrentUserProperties Error", error);
      return {
        error: "Unable to fetch current user properties. Error message: " + (error?.["odata.error"]?.message?.value ?? "Something went wrong. ") + RECOMMENDED_ERROR_ACTIONS_FOR_UI.reload,
      };
    });
}
