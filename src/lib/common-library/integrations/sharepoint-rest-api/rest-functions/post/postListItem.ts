import { SHAREPOINT_CONFIG } from "$lib/env/sharepoint-config";
import { RECOMMENDED_ERROR_ACTIONS_FOR_UI } from "../../constants/const";
import { getFormDigestValue } from "../get/getFormDigestValue";
import type { Sharepoint_Error_Formatted, Sharepoint_PostItem_SuccessResponse_WithPostedData, Sharepoint_PostItemResponse } from "../../data/types";

export async function postListItem<DataToPost extends Record<string, any>, DataToIncludeInResponseInLocalMode extends Record<string, any>>(options: {
  siteCollectionUrl?: string;
  listName: string;
  dataToPost: DataToPost;
  formDigest?: string;
  listNameReplaced?: string;
  logToConsole?: boolean;
  signal?: AbortSignal; // Optional abort signal for request cancellation
}): Promise<Sharepoint_PostItem_SuccessResponse_WithPostedData<DataToPost, DataToIncludeInResponseInLocalMode> | Sharepoint_Error_Formatted> {
  if (options.logToConsole) console.log(options.dataToPost);
  if (!options.formDigest) options.formDigest = (await getFormDigestValue()) as string;

  const request = new Request(`${options.siteCollectionUrl ?? SHAREPOINT_CONFIG.paths.site_collection}/_api/web/lists/GetByTitle('${options.listName}')/items`, {
    method: "POST",
    credentials: "same-origin", // or credentials: 'include'
    headers: new Headers({
      Accept: "application/json;odata=nometadata",
      "Content-Type": "application/json; odata=nometadata",
      "X-RequestDigest": options.formDigest,
      "IF-MATCH": "*",
    }),
    body: JSON.stringify({
      // Do not include this '__metadata' when using "odata=nometadata" in "Content-Type",
      // __metadata: {
      //   type: `SP.Data.${capitalizeFirstLetter(options.listNameReplaced ?? options.listName)}ListItem`,
      // },
      ...options.dataToPost,
    }),
  });

  return fetch(request, { signal: options.signal ?? null })
    .then((response) => response.json())
    .then((data: Sharepoint_PostItemResponse<DataToPost, DataToIncludeInResponseInLocalMode>) => {
      if (options.logToConsole) console.log("FN: postListItem Response", data);
      if (!data || "odata.error" in data) {
        return {
          error: "Error message: " + (data?.["odata.error"].message.value ?? "Something went wrong. ") + RECOMMENDED_ERROR_ACTIONS_FOR_UI.reload,
        };
      }
      return data;
    })
    .catch((error) => {
      if (options.logToConsole) console.log("FN: postListItem Error", error);
      if (error instanceof Error && error.name === "AbortError") {
        return {
          error: "Request timed out or was cancelled. " + RECOMMENDED_ERROR_ACTIONS_FOR_UI.reload,
        };
      }
      return {
        error: "Network error occurred. " + RECOMMENDED_ERROR_ACTIONS_FOR_UI.reload,
      };
    });
}
