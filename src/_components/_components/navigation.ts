import type { AccessRole } from "$lib/common-library/sharepoint-rest-api/types";
import { p, type Routes } from "sv-router/generated";

export const NAVIGATION_MENU_ITEMS: { name: string; route: ReturnType<typeof p>; accessRole?: AccessRole; slug?: string }[] = [
  {
    name: "Home",
    // route: p("/"),
    route: "/",
  },
  {
    name: "Stories",
    // route: p("/stories"),
    route: "/stories",
  },
  {
    name: "Create",
    // route: p("/stories/:slug", { params: { slug: "new" } }),
    route: "/stories/new",
  },
  {
    name: "Admin",
    // route: p("/admin"),
    route: "/admin",
    accessRole: "Admin",
  },
];
