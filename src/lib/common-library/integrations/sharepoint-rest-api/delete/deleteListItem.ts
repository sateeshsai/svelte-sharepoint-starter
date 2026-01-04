import { LOCAL_MODE } from "$lib/common-library/utils/local-dev/modes";
import { RECOMMENDED_ERROR_ACTIONS_FOR_UI } from "../const";
import { getFormDigestValue } from "../get/getFormDigestValue";
import { LOCAL_LIST_ITEM_UPDATE_SUCCESS_RESPONSE } from "../local-data";
import type { Sharepoint_Error_Formatted, Sharepoint_UpdateItemResponse, Sharepoint_UpdateItem_DataResponse } from "../types";

export async function deleteListItem(options: {
  siteCollectionUrl: string;
  listName: string;
  itemId: number;
  formDigest?: string;
  listNameReplaced?: string;
  logToConsole?: boolean;
}): Promise<Sharepoint_Error_Formatted | Sharepoint_UpdateItem_DataResponse> {
  if (!options.formDigest) options.formDigest = (await getFormDigestValue()) as string;

  const request = new Request(`${options.siteCollectionUrl}/_api/web/lists/GetByTitle('${options.listName}')/items(${options.itemId})`, {
    method: "POST",
    credentials: "same-origin", // or credentials: 'include'
    //@ts-ignore
    headers: new Headers({
      Accept: "application/json; odata=verbose",
      "Content-Type": "application/json; odata=verbose",
      "X-RequestDigest": options.formDigest,
      "X-HTTP-Method": "DELETE",
      "IF-MATCH": "*",
    }),
  });

  if (LOCAL_MODE) {
    return new Promise((res, rej) => {
      setTimeout(() => res(LOCAL_LIST_ITEM_UPDATE_SUCCESS_RESPONSE), 200);
    });
  }

  return fetch(request)
    .then((response) => response.json())
    .then((data: Sharepoint_UpdateItemResponse) => {
      if (options.logToConsole) console.log("FN: deleteListItem Response", data);
      if (!data || "odata.error" in data) {
        return {
          error: "Error message: " + (data?.["odata.error"].message.value ?? "Something went wrong. ") + RECOMMENDED_ERROR_ACTIONS_FOR_UI.reload,
        };
      }

      if (!data.ok) {
        return {
          error: "Error message: Status - " + data.status + ". Status text: " + data.statusText + RECOMMENDED_ERROR_ACTIONS_FOR_UI.reload,
        };
      }
      return data;
    })
    .catch((error) => {
      if (options.logToConsole) console.log("FN: deleteListItem Error", error);
      return {
        error: "Error message: " + (error?.["odata.error"]?.message?.value ?? "Something went wrong. ") + RECOMMENDED_ERROR_ACTIONS_FOR_UI.reload,
      };
    });
}
