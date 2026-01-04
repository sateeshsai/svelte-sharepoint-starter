import { LOCAL_MODE } from "$lib/common-library/utils/local-dev/modes";
import { SHAREPOINT_ENV } from "$lib/env/env";
import { RECOMMENDED_ERROR_ACTIONS_FOR_UI } from "../const";
import type { Sharepoint_Error, Sharepoint_Error_Formatted, Sharepoint_Get_Operations } from "../types";

export function getListItems<T extends { value: Record<string, any> }>(options: {
  siteCollectionUrl?: string;
  listName: string;
  operations?: Sharepoint_Get_Operations;
  dataToReturnInLocalMode: T; //To simulate API returning your data in local dev mode,
  logToConsole?: boolean;
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

  const requestURL = `${options.siteCollectionUrl ?? SHAREPOINT_ENV.paths.site_collection}/_api/web/lists/GetByTitle('${options.listName}')/items${queryString}`;
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

  if (LOCAL_MODE) {
    return new Promise((res, rej) => {
      setTimeout(() => {
        res(options.dataToReturnInLocalMode);
      }, 300);
    });
  }

  return fetch(fetchRequest)
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
      return {
        error: "Error message: " + (error?.["odata.error"]?.message?.value ?? "Something went wrong. ") + RECOMMENDED_ERROR_ACTIONS_FOR_UI.reload,
      };
    });
}
