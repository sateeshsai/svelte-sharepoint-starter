import { randomInt } from "$lib/common-library/utils/functions/number";
import { capitalizeFirstLetter } from "$lib/common-library/utils/functions/string";
import { LOCAL_MODE } from "$lib/common-library/utils/local-dev/modes";
import { SHAREPOINT_ENV } from "$lib/env/env";
import { RECOMMENDED_ERROR_ACTIONS_FOR_UI } from "../const";
import { getFormDigestValue } from "../get/getFormDigestValue";
import type { Sharepoint_Error_Formatted, Sharepoint_PostItem_SuccessResponse, Sharepoint_PostItem_SuccessResponse_WithPostedData, Sharepoint_PostItemResponse } from "../types";

export async function postListItem<DataToPost extends Record<string, any>, DataToIncludeInResponseInLocalMode extends Record<string, any>>(options: {
  siteCollectionUrl?: string;
  listName: string;
  dataToPost: DataToPost;
  formDigest?: string;
  listNameReplaced?: string;
  logToConsole?: boolean;
  dataToIncludeInResponse_InLocalMode?: DataToIncludeInResponseInLocalMode;
}): Promise<Sharepoint_PostItem_SuccessResponse_WithPostedData<DataToPost, DataToIncludeInResponseInLocalMode> | Sharepoint_Error_Formatted> {
  if (options.logToConsole) console.log(options.dataToPost);
  if (!options.formDigest) options.formDigest = (await getFormDigestValue()) as string;

  const request = new Request(`${options.siteCollectionUrl ?? SHAREPOINT_ENV.paths.site_collection}/_api/web/lists/GetByTitle('${options.listName}')/items`, {
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

  if (LOCAL_MODE) {
    return new Promise((res, rej) => {
      setTimeout(
        () =>
          res({
            Id: randomInt(),
            ...options.dataToPost,
            ...options.dataToIncludeInResponse_InLocalMode,
          } as Sharepoint_PostItem_SuccessResponse & DataToPost & DataToIncludeInResponseInLocalMode),
        200
      );
    });
  }

  return fetch(request)
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
      return {
        error: "Error message: " + (error?.["odata.error"]?.message?.value ?? "Something went wrong. ") + RECOMMENDED_ERROR_ACTIONS_FOR_UI.reload,
      };
    });
}
