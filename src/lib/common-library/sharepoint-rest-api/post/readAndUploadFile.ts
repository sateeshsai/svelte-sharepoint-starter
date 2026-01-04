import { SHAREPOINT_ENV } from "$lib/env/env";
import { LOCAL_MODE } from "../../local-dev/modes";
import { RECOMMENDED_ERROR_ACTIONS_FOR_UI } from "../const";
import { getFormDigestValue } from "../get/getFormDigestValue";
import type { Sharepoint_Error, Sharepoint_Error_Formatted, Sharepoint_UploadFile_SuccessResponse } from "../types";

export async function readAnduploadFile(options: {
  siteCollectionUrl?: string;
  serverRelativeUrl: string;
  foldername: string;
  logToConsole?: boolean;
  file: {
    name: string;
    obj: File;
  };
}): Promise<Sharepoint_UploadFile_SuccessResponse | Sharepoint_Error_Formatted> {
  if (LOCAL_MODE) {
    return new Promise((res, rej) => {
      setTimeout(
        () =>
          res({
            Name: options.file.name,
            ServerRelativeUrl: options.serverRelativeUrl + options.foldername + "/" + options.file.name,
          } as Sharepoint_UploadFile_SuccessResponse),
        3000
      );
    });
  }

  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onloadend = async (e) => {
      if (e.target?.readyState == FileReader.DONE) {
        const fileBuffer = e.target.result;
        let formDigestValue = await getFormDigestValue({});
        const request = new Request(
          `${options.siteCollectionUrl ?? SHAREPOINT_ENV.paths.site_collection}/_api/web/GetFolderByServerRelativeUrl('${options.foldername}')/Files/add(url='${options.file.name}',overwrite=true)`,
          {
            method: "POST",
            credentials: "same-origin", // or credentials: 'include'
            // @ts-ignore
            headers: new Headers({
              Accept: "application/json;odata=nometadata",
              "X-RequestDigest": formDigestValue,
            }),
            body: fileBuffer,
          }
        );
        resolve(
          fetch(request)
            .then((response) => response.json())
            .then((data: Sharepoint_UploadFile_SuccessResponse | Sharepoint_Error | undefined) => {
              if (options.logToConsole) console.log("FN: readAnduploadFile Response", data, options.file.name);
              if (!data || "odata.error" in data) {
                return {
                  error: "Error message: " + (data?.["odata.error"].message.value ?? "Something went wrong. ") + RECOMMENDED_ERROR_ACTIONS_FOR_UI.reload,
                };
              }
              return data;
            })
            .catch((error) => {
              if (options.logToConsole) console.log("FN: readAnduploadFile Error", error);
              return {
                error: "Error message: " + (error?.["odata.error"].message.value ?? "Something went wrong. ") + RECOMMENDED_ERROR_ACTIONS_FOR_UI.reload,
              };
            })
        );
      } else {
        reject({
          error: "Error reading file: " + options.file.name,
        });
      }
    };

    reader.readAsArrayBuffer(options.file.obj);
  });
}
