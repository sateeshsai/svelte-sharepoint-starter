/**
 * File Local Data - Mock data for LOCAL_MODE development
 */
import type { File_ListItem } from "./schemas";

export const LOCAL_FILES: File_ListItem[] = [
  // Story 1: Beyond the Stars - Multiple files with varied types
  {
    Id: 1,
    Title: "1.avif",
    Created: new Date("2024-03-15").toISOString(),
    Modified: new Date("2024-03-15").toISOString(),
    Description: "The orbiting space station above Earth",
    Author: {
      Id: 1,
      Title: "Modukuru, Sateeshsai",
    },
    Parent: { Id: 1, Title: "Beyond the Stars" },
    ParentType: "Story",
    FileOrder: 1,
  },
  {
    Id: 2,
    Title: "2.avif",
    Created: new Date("2024-03-15").toISOString(),
    Modified: new Date("2024-03-15").toISOString(),
    Description: "A stunning view of distant galaxies",
    Author: {
      Id: 1,
      Title: "Modukuru, Sateeshsai",
    },
    Parent: { Id: 1, Title: "Beyond the Stars" },
    ParentType: "Story",
    FileOrder: 2,
  },
  {
    Id: 3,
    Title: "space-mission.mp4",
    Created: new Date("2024-03-15").toISOString(),
    Modified: new Date("2024-03-15").toISOString(),
    Description: "Video documentation of the mission launch",
    Author: {
      Id: 1,
      Title: "Modukuru, Sateeshsai",
    },
    Parent: { Id: 1, Title: "Beyond the Stars" },
    ParentType: "Story",
    FileOrder: 3,
  },
  // Story 2: Whispers of the Forest - Nature images
  {
    Id: 4,
    Title: "3.avif",
    Created: new Date("2024-06-10").toISOString(),
    Modified: new Date("2024-06-10").toISOString(),
    Description: "Towering trees in the heart of the forest",
    Author: {
      Id: 2,
      Title: "Mooring, James",
    },
    Parent: { Id: 2, Title: "Whispers of the Forest" },
    ParentType: "Story",
    FileOrder: 1,
  },
  {
    Id: 5,
    Title: "4.avif",
    Created: new Date("2024-06-10").toISOString(),
    Modified: new Date("2024-06-10").toISOString(),
    Description: "A peaceful stream flowing through the woods",
    Author: {
      Id: 2,
      Title: "Mooring, James",
    },
    Parent: { Id: 2, Title: "Whispers of the Forest" },
    ParentType: "Story",
    FileOrder: 2,
  },
  // Story 3: The Mountain's Tale - Mountain images
  {
    Id: 6,
    Title: "5.avif",
    Created: new Date("2023-12-05").toISOString(),
    Modified: new Date("2023-12-05").toISOString(),
    Description: "The summit view at sunrise",
    Author: {
      Id: 3,
      Title: "Gupta, Tripti",
    },
    Parent: { Id: 3, Title: "The Mountain's Tale" },
    ParentType: "Story",
    FileOrder: 1,
  },
  {
    Id: 7,
    Title: "6.avif",
    Created: new Date("2023-12-05").toISOString(),
    Modified: new Date("2023-12-05").toISOString(),
    Description: "The vast valley stretching to the horizon",
    Author: {
      Id: 3,
      Title: "Gupta, Tripti",
    },
    Parent: { Id: 3, Title: "The Mountain's Tale" },
    ParentType: "Story",
    FileOrder: 2,
  },
  // Story 4: Minimum Title - Single file (testing minimum)
  {
    Id: 8,
    Title: "4.avif",
    Created: new Date("2025-01-01").toISOString(),
    Modified: new Date("2025-01-01").toISOString(),
    Description: "Single supporting image for minimal story",
    Author: {
      Id: 1,
      Title: "Modukuru, Sateeshsai",
    },
    Parent: { Id: 4, Title: "Minimum Title" },
    ParentType: "Story",
    FileOrder: 1,
  },
  // Story 5: Draft Story - Files being prepared
  {
    Id: 9,
    Title: "5.avif",
    Created: new Date("2025-01-05").toISOString(),
    Modified: new Date("2025-01-06").toISOString(),
    Description: "Work in progress image",
    Author: {
      Id: 2,
      Title: "Mooring, James",
    },
    Parent: { Id: 5, Title: "A Draft Story That Is Currently Being Written and Edited" },
    ParentType: "Story",
    FileOrder: 1,
  },
  // Story 6: Inactive Story - No files (testing zero files case)

  // Story 7: Digital Transformation - Multiple professional documents
  {
    Id: 10,
    Title: "7.avif",
    Created: new Date("2024-09-20").toISOString(),
    Modified: new Date("2024-09-20").toISOString(),
    Description: "Digital transformation framework diagram",
    Author: {
      Id: 1,
      Title: "Modukuru, Sateeshsai",
    },
    Parent: { Id: 7, Title: "The Art of Digital Transformation in Modern Enterprises" },
    ParentType: "Story",
    FileOrder: 1,
  },
  {
    Id: 11,
    Title: "transformation-case-study.pdf",
    Created: new Date("2024-09-20").toISOString(),
    Modified: new Date("2024-09-20").toISOString(),
    Description: "Detailed case study with implementation strategies and ROI analysis",
    Author: {
      Id: 1,
      Title: "Modukuru, Sateeshsai",
    },
    Parent: { Id: 7, Title: "The Art of Digital Transformation in Modern Enterprises" },
    ParentType: "Story",
    FileOrder: 2,
  },
  {
    Id: 12,
    Title: "enterprise-architecture.png",
    Created: new Date("2024-09-20").toISOString(),
    Modified: new Date("2024-09-20").toISOString(),
    Description: "Reference architecture for modern digital enterprises",
    Author: {
      Id: 1,
      Title: "Modukuru, Sateeshsai",
    },
    Parent: { Id: 7, Title: "The Art of Digital Transformation in Modern Enterprises" },
    ParentType: "Story",
    FileOrder: 3,
  },
  // Story 8: Empty Tags - Single file
  {
    Id: 13,
    Title: "8.avif",
    Created: new Date("2024-11-15").toISOString(),
    Modified: new Date("2024-11-15").toISOString(),
    Description: "Generic supporting image",
    Author: {
      Id: 3,
      Title: "Gupta, Tripti",
    },
    Parent: { Id: 8, Title: "Empty Tags Story" },
    ParentType: "Story",
    FileOrder: 1,
  },
  // Story 9: Rich Media - Many files with varied captions (testing maximum)
  {
    Id: 14,
    Title: "9.avif",
    Created: new Date("2024-08-10").toISOString(),
    Modified: new Date("2024-08-10").toISOString(),
    Description: "First showcase image demonstrating high-resolution rendering",
    Author: {
      Id: 2,
      Title: "Mooring, James",
    },
    Parent: { Id: 9, Title: "Rich Media Story with Multiple Images and Complex Formatting" },
    ParentType: "Story",
    FileOrder: 1,
  },
  {
    Id: 15,
    Title: "10.avif",
    Created: new Date("2024-08-10").toISOString(),
    Modified: new Date("2024-08-10").toISOString(),
    Description: "Second image with medium-length caption for testing text wrapping and layout",
    Author: {
      Id: 2,
      Title: "Mooring, James",
    },
    Parent: { Id: 9, Title: "Rich Media Story with Multiple Images and Complex Formatting" },
    ParentType: "Story",
    FileOrder: 2,
  },
  {
    Id: 16,
    Title: "11.avif",
    Created: new Date("2024-08-10").toISOString(),
    Modified: new Date("2024-08-10").toISOString(),
    Description: "Short",
    Author: {
      Id: 2,
      Title: "Mooring, James",
    },
    Parent: { Id: 9, Title: "Rich Media Story with Multiple Images and Complex Formatting" },
    ParentType: "Story",
    FileOrder: 3,
  },
  {
    Id: 17,
    Title: "12.avif",
    Created: new Date("2024-08-10").toISOString(),
    Modified: new Date("2024-08-10").toISOString(),
    Description:
      "This is an extremely long caption designed to test how the UI handles captions that extend beyond typical lengths, including multiple sentences with detailed information about the image content, technical specifications, and contextual details that might be relevant to understanding the visual.",
    Author: {
      Id: 2,
      Title: "Mooring, James",
    },
    Parent: { Id: 9, Title: "Rich Media Story with Multiple Images and Complex Formatting" },
    ParentType: "Story",
    FileOrder: 4,
  },
  {
    Id: 18,
    Title: "demo-video.mp4",
    Created: new Date("2024-08-10").toISOString(),
    Modified: new Date("2024-08-10").toISOString(),
    Description: "Video demonstration of rich media capabilities",
    Author: {
      Id: 2,
      Title: "Mooring, James",
    },
    Parent: { Id: 9, Title: "Rich Media Story with Multiple Images and Complex Formatting" },
    ParentType: "Story",
    FileOrder: 5,
  },
  {
    Id: 19,
    Title: "audio-narration.mp3",
    Created: new Date("2024-08-10").toISOString(),
    Modified: new Date("2024-08-10").toISOString(),
    Description: "Audio narration track for accessibility",
    Author: {
      Id: 2,
      Title: "Mooring, James",
    },
    Parent: { Id: 9, Title: "Rich Media Story with Multiple Images and Complex Formatting" },
    ParentType: "Story",
    FileOrder: 6,
  },
  // Story 10: Very Recent - Fresh files
  {
    Id: 20,
    Title: "10.avif",
    Created: new Date().toISOString(),
    Modified: new Date().toISOString(),
    Description: "Just uploaded image file",
    Author: {
      Id: 1,
      Title: "Modukuru, Sateeshsai",
    },
    Parent: { Id: 10, Title: "Very Recent Story" },
    ParentType: "Story",
    FileOrder: 1,
  },
  // Story 11: Collaboration - No files (testing another zero-file case)

  // Story 12: Special Characters - Testing special chars in filenames and descriptions
  {
    Id: 21,
    Title: "special-chars-&-symbols.avif",
    Created: new Date("2024-07-20").toISOString(),
    Modified: new Date("2024-07-20").toISOString(),
    Description: "Testing special chars: & < > \" ' and emojis 🚀 😊 in descriptions",
    Author: {
      Id: 2,
      Title: "Mooring, James",
    },
    Parent: { Id: 12, Title: "Special Characters & Symbols Test: Unicode, Emojis 🚀, and More!" },
    ParentType: "Story",
    FileOrder: 1,
  },
];
