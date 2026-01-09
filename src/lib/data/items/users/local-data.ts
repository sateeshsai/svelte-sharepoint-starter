/**
 * User Local Data - Mock data for LOCAL_MODE development
 */
import type { User_ListItem } from "./schemas";

export const LOCAL_USERS: User_ListItem[] = [
  {
    Id: 1,
    Title: "Sateesh Modukuru",
    User: {
      Id: 1,
      Title: "Modukuru, Sateeshsai",
    },
    AccessRole: "Admin",
    Created: new Date("2023-01-15").toISOString(),
    Modified: new Date("2023-01-15").toISOString(),
  },
  {
    Id: 2,
    Title: "Jim Mooring",
    User: {
      Id: 2,
      Title: "Mooring, James",
    },
    AccessRole: null,
    Created: new Date("2023-02-20").toISOString(),
    Modified: new Date("2023-02-20").toISOString(),
  },
  {
    Id: 3,
    Title: "Tripti Gupta",
    User: {
      Id: 3,
      Title: "Gupta, Tripti",
    },
    AccessRole: null,
    Created: new Date("2023-03-10").toISOString(),
    Modified: new Date("2023-03-10").toISOString(),
  },
];
