// Config exports
export { validateSharePointConfig, SharePointConfigSchema } from "./config";
export type { SharePointConfig } from "./config";

// Data exports
export type {
  Sharepoint_User,
  Sharepoint_User_Properties,
  Sharepoint_Error,
  Sharepoint_Error_Formatted,
  Sharepoint_FormDigestResponse,
  Sharepoint_Get_Operations,
  Sharepoint_PostItem_SuccessResponse_WithPostedData,
  Sharepoint_PostItemResponse,
  Sharepoint_UploadFile_SuccessResponse,
  Sharepoint_UpdateItemResponse,
  Sharepoint_UpdateItem_DataResponse,
  Sharepoint_Lookup_DefaultProps,
  Sharepoint_Default_Props,
  AccessRole,
} from "./data";
export { Sharepoint_Default_Props_Schema, Sharepoint_Lookup_DefaultProps_Schema, LOCAL_SHAREPOINT_USERS, LOCAL_SHAREPOINT_USERS_PROPERTIES } from "./data";

// Constants exports
export { ACCESS_ROLES, RECOMMENDED_ERROR_ACTIONS_FOR_UI } from "./constants";

// Utilities exports
export { createSelectExpandQueries, getPictureUrl, getUserFirstLastNames } from "./utilities";

// Provider exports
export type { DataProvider } from "./providers";
export { BaseMockDataProvider } from "./providers";
export { SharePointDataProvider } from "./providers";
export { getDataProvider, registerProviders } from "./providers/provider-registry";

// REST function exports - organized by HTTP method
export * from "./rest-functions";
