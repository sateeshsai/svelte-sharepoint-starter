import dayjs from "dayjs";
import { z } from "zod";

export const SharepointTitleProps_Schema = z.strictObject({
  Title: z
    .string()
    .max(255)
    .default("Untitled" + dayjs().format()),
});

export const Sharepoint_Lookup_DefaultProps_Schema = z.strictObject({
  ...SharepointTitleProps_Schema.shape,
  Id: z.number().positive(),
});

export const Sharepoint_Default_Props_Schema = z.strictObject({
  ...Sharepoint_Lookup_DefaultProps_Schema.shape,
  Created: z.iso.datetime(),
  Modified: z.iso.datetime(),
});
