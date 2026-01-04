import type { Engagement_ListItem, File_ListItem, Story_ListItem, User_ListItem } from "$lib/data/types";

export const LOCAL_STORY_ITEMS: Story_ListItem[] = [
  {
    Id: 1,
    Title: "First story",
    Introduction: "First story Dignissimos aliquam, aspernatur labore officiis omnis dolores totam reiciendis beatae unde accusamus",
    Content:
      "<h2>Lorem ipsum dolor sit amet consectetur</h2> <p>Dignissimos aliquam, aspernatur labore officiis omnis dolores totam reiciendis beatae unde accusamus nulla placeat optio consequuntur sed impedit sunt maiores, quod aut? Dignissimos aliquam, aspernatur labore officiis omnis dolores totam reiciendis beatae unde accusamus nulla placeat optio consequuntur sed impedit sunt maiores, quod aut. Dignissimos aliquam, aspernatur labore officiis omnis dolores totam reiciendis beatae unde accusamus nulla placeat optio consequuntur sed impedit sunt maiores.</p><p>Dignissimos aliquam, aspernatur labore officiis omnis dolores totam reiciendis beatae unde accusamus nulla placeat optio consequuntur sed impedit sunt maiores, quod aut? Dignissimos aliquam, aspernatur labore officiis omnis dolores totam reiciendis beatae unde accusamus nulla placeat optio consequuntur sed impedit sunt maiores, quod aut. Dignissimos aliquam, aspernatur labore officiis omnis dolores totam reiciendis beatae unde accusamus nulla placeat optio consequuntur sed impedit sunt maiores.</p>",
    Created: new Date("10/10/2023").toISOString(),
    Modified: new Date("10/10/2023").toISOString(),
    Author: {
      Id: 1,
      Title: "Modukuru, Sateeshsai",
    },
    Engagements: [],
    Tags: "One, Three",
    CoverFileName: "1.avif",
  },
  {
    Id: 2,
    Title: "Second story",
    Introduction: "Second story Reiciendis beatae unde accusamus nulla placeat optio consequuntur sed impedit sunt maiores",
    Content: "Dignissimos aliquam, aspernatur labore officiis omnis dolores totam reiciendis beatae unde accusamus nulla placeat optio consequuntur sed impedit sunt maiores, quod aut?",
    Created: new Date("10/10/2024").toISOString(),
    Modified: new Date("10/10/2024").toISOString(),
    Author: {
      Id: 2,
      Title: "Mooring, James",
    },
    Engagements: [],
    Tags: "Two, Four",
    CoverFileName: "2.avif",
  },
  {
    Id: 3,
    Title: "Third story",
    Introduction: "Third story Reiciendis beatae unde accusamus nulla placeat optio consequuntur sed impedit sunt maiores",
    Content: "Third story Dignissimos aliquam, aspernatur labore officiis omnis dolores totam reiciendis beatae unde accusamus nulla placeat optio consequuntur sed impedit sunt maiores, quod aut?",
    Created: new Date().toISOString(),
    Modified: new Date().toISOString(),
    Author: {
      Id: 1,
      Title: "Modukuru, Sateeshsai",
    },
    Engagements: [],
    Tags: "Two, Four",
    CoverFileName: "3.avif",
  },
  {
    Id: 4,
    Title: "Fourth story",
    Introduction: "Third story Reiciendis beatae unde accusamus nulla placeat optio consequuntur sed impedit sunt maiores",
    Content: "Third story Dignissimos aliquam, aspernatur labore officiis omnis dolores totam reiciendis beatae unde accusamus nulla placeat optio consequuntur sed impedit sunt maiores, quod aut?",
    Created: new Date().toISOString(),
    Modified: new Date().toISOString(),
    Author: {
      Id: 1,
      Title: "Modukuru, Sateeshsai",
    },
    Engagements: [],
    Tags: "Two, Four",
    CoverFileName: "4.avif",
  },
];

export const LOCAL_ENGAGEMENTS: Engagement_ListItem[] = [
  {
    Id: 1,
    Title: "❤️",
    Created: new Date().toISOString(),
    Modified: new Date().toISOString(),
    Author: {
      Id: 1,
      Title: "Modukuru, Sateeshsai",
    },
    Parent: { Id: 1, Title: "First story" },
    ParentType: "Story",
  },
  {
    Id: 2,
    Title: "💚",
    Created: new Date().toISOString(),
    Modified: new Date().toISOString(),
    Author: {
      Id: 2,
      Title: "Mooring, James",
    },
    Parent: { Id: 2, Title: "Second story" },
    ParentType: "Story",
  },
  {
    Id: 3,
    Title: "❤️",
    Created: new Date().toISOString(),
    Modified: new Date().toISOString(),
    Author: {
      Id: 3,
      Title: "Gupta, Tripti",
    },
    Parent: { Id: 1, Title: "First story" },
    ParentType: "Story",
  },
];

export const LOCAL_FILES: File_ListItem[] = [
  {
    Id: 1,
    Title: "1.avif",
    Created: new Date().toISOString(),
    Modified: new Date().toISOString(),
    Description: "This is a caption for a file",
    Author: {
      Id: 1,
      Title: "Modukuru, Sateeshsai",
    },
    Parent: { Id: 1, Title: "First story" },
    ParentType: "Story",
    FileOrder: 1,
  },
  {
    Id: 2,
    Title: "1.mp4",
    Created: new Date().toISOString(),
    Modified: new Date().toISOString(),
    Description: "This is another caption",
    Author: {
      Id: 1,
      Title: "Modukuru, Sateeshsai",
    },
    Parent: { Id: 1, Title: "First story" },
    ParentType: "Story",
    FileOrder: 2,
  },
  {
    Id: 3,
    Title: "1.mp3",
    Created: new Date().toISOString(),
    Modified: new Date().toISOString(),
    Description: "This is another sample which is longer than others",
    Author: {
      Id: 1,
      Title: "Modukuru, Sateeshsai",
    },
    Parent: { Id: 1, Title: "First story" },
    ParentType: "Story",
    FileOrder: 3,
  },
  {
    Id: 4,
    Title: "1.pdf",
    Created: new Date().toISOString(),
    Modified: new Date().toISOString(),
    Description: "One more",
    Author: {
      Id: 1,
      Title: "Modukuru, Sateeshsai",
    },
    Parent: { Id: 1, Title: "First story" },
    ParentType: "Story",
    FileOrder: 4,
  },
  {
    Id: 5,
    Title: "11.avif",
    Created: new Date().toISOString(),
    Modified: new Date().toISOString(),
    Description: "Another caption",
    Author: {
      Id: 1,
      Title: "Modukuru, Sateeshsai",
    },
    Parent: { Id: 1, Title: "First story" },
    ParentType: "Story",
    FileOrder: 5,
  },
  {
    Id: 6,
    Title: "12.avif",
    Created: new Date().toISOString(),
    Modified: new Date().toISOString(),
    Description: "A caption",
    Author: {
      Id: 1,
      Title: "Modukuru, Sateeshsai",
    },
    Parent: { Id: 1, Title: "First story" },
    ParentType: "Story",
    FileOrder: 6,
  },
  {
    Id: 7,
    Title: "2.avif",
    Created: new Date().toISOString(),
    Modified: new Date().toISOString(),
    Description: "Unde accusamus nulla placeat optio consequuntur",
    Author: {
      Id: 1,
      Title: "Modukuru, Sateeshsai",
    },
    Parent: { Id: 2, Title: "Second story" },
    ParentType: "Story",
    FileOrder: 1,
  },
  {
    Id: 8,
    Title: "3.avif",
    Created: new Date().toISOString(),
    Modified: new Date().toISOString(),
    Description: "Placeat optio consequuntur",
    Author: {
      Id: 2,
      Title: "Mooring, James",
    },
    Parent: { Id: 2, Title: "Second story" },
    ParentType: "Story",
    FileOrder: 2,
  },
];

export const LOCAL_USERS: User_ListItem[] = [
  {
    Id: 1,
    Title: "Sateesh Modukuru",
    User: {
      Id: 1,
      Title: "Modukuru, Sateeshsai",
    },
    AccessRole: "Admin",
    Created: new Date().toISOString(),
    Modified: new Date().toISOString(),
  },
  {
    Id: 2,
    Title: "Jim Mooring",
    User: {
      Id: 2,
      Title: "Mooring, James",
    },
    AccessRole: null,
    Created: new Date().toISOString(),
    Modified: new Date().toISOString(),
  },
];
