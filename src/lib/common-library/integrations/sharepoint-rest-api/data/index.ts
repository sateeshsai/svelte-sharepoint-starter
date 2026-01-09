/**
 * SharePoint REST API Data - Core types and mock data
 *
 * This folder contains SharePoint-generic data structures:
 * - schemas.ts: Base Zod schemas for SharePoint item properties
 * - types.ts: TypeScript types for SharePoint API responses
 * - local-data.ts: Mock user data for LOCAL_MODE testing
 *
 * For app-specific item types (Stories, Files, etc.), see:
 * $lib/data/items/{itemName}/schemas.ts
 */

// Core schemas
export { Sharepoint_Default_Props_Schema, Sharepoint_Lookup_DefaultProps_Schema } from "./schemas";

// Types
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
} from "./types";

// Mock data for LOCAL_MODE
export { LOCAL_SHAREPOINT_USERS, LOCAL_SHAREPOINT_USERS_PROPERTIES } from "./local-data";
