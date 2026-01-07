import type z from "zod";
import type { LOCAL_SHAREPOINT_USERS, LOCAL_SHAREPOINT_USERS_PROPERTIES } from "./local-data";
import { Sharepoint_Default_Props_Schema, Sharepoint_Lookup_DefaultProps_Schema } from "./schemas";

import { ACCESS_ROLES } from "../constants/const";
export type AccessRole = (typeof ACCESS_ROLES)[number];

export type Sharepoint_User_Properties = (typeof LOCAL_SHAREPOINT_USERS_PROPERTIES)[0];
export type Sharepoint_User = (typeof LOCAL_SHAREPOINT_USERS)[0];
export type Sharepoint_Lookup_DefaultProps = z.infer<typeof Sharepoint_Lookup_DefaultProps_Schema>;
export type Sharepoint_Default_Props = z.infer<typeof Sharepoint_Default_Props_Schema>;

export interface Sharepoint_FormDigestResponse {
  d: {
    GetContextWebInformation: {
      FormDigestValue: string;
    };
  };
}

// data.d.GetContextWebInformation.FormDigestValue
export interface Sharepoint_Error {
  "odata.error": {
    code: string;
    message: {
      lang: string;
      value: string;
    };
  };
}

export interface Sharepoint_Error_Formatted {
  error: string;
}

export interface Sharepoint_PostItem_SuccessResponse extends Sharepoint_Default_Props {
  // [key: string]: any;
  FileSystemObjectType: number;
  ContentTypeId: string;
  ID: number;
  AuthorId: number;
  EditorId: number;
  OData__UIVersionString: string;
  Attachments: false;
  GUID: string;
}

export type Sharepoint_PostItem_SuccessResponse_WithPostedData<DataToPost, DataToIncludeInResponseInLocalMode> = Sharepoint_PostItem_SuccessResponse & DataToPost & DataToIncludeInResponseInLocalMode;

export type Sharepoint_PostItemResponse<DataToPost, DataToIncludeInResponseInLocalMode> =
  | Sharepoint_PostItem_SuccessResponse_WithPostedData<DataToPost, DataToIncludeInResponseInLocalMode>
  | Sharepoint_Error_Formatted;

export interface Sharepoint_UpdateItem_DataResponse {
  ok: boolean;
  status: number; //204 / 404 ;
  statusText: string;
}

export type Sharepoint_UpdateItemResponse = Sharepoint_UpdateItem_DataResponse | Sharepoint_Error | undefined;

export interface Sharepoint_UploadFile_SuccessResponse {
  // extends Sharepoint_Lookup_DefaultProps
  Name: string;
  ServerRelativeUrl: string; //sites/sitename/folder/filename.ext
  Length: number;
  TimeCreated: string;
  TimeLastModified: string;
  UniqueId: string;
  CheckInComment: "";
  CheckOutType: number;
  ContentTag: string;
  CustomizedPageStatus: number;
  ETag: string;
  Exists: true;
  IrmEnabled: false;
  Level: number;
  LinkingUrl: string;
  MajorVersion: number;
  MinorVersion: number;
  UIVersion: number;
  UIVersionLabel: string;
}

// export type Sharepoint_UploadFileResponse = Sharepoint_UploadFile_SuccessResponse | Sharepoint_Error | undefined;

/**
 * SharePoint OData query operations
 * - select: Comma-separated field names, supports nested (e.g., "Id,Title,Author/Id,Author/Title")
 * - filter: OData filter expression (e.g., "Id eq 5", "Author/Id eq 1 and Created ge '2024-01-01'")
 * - expand: Comma-separated lookup fields to expand (e.g., "Author,Editor")
 * - top: Maximum number of items to return
 * - skip: Number of items to skip (for pagination)
 * - orderby: Sort direction, sorts by Created field
 */
export type Sharepoint_Get_Operations = (["select", string] | ["filter", string] | ["expand", string] | ["top", number] | ["skip", number] | ["orderby", "asc" | "desc"])[] | `$${string}=${string}`;
