/**
 * App-specific marketing content for the starter project
 * Used on home page to highlight key benefits
 */
export interface FrameworkFeature {
  text: string;
  category: "infrastructure" | "developer-experience" | "production-ready" | "sharepoint";
  icon?: string;
  priority: number; // Lower = higher priority (1 = most important)
}

export const FRAMEWORK_FEATURES: FrameworkFeature[] = [
  // Infrastructure & Architecture
  {
    text: "Built for SharePoint 2013 on-prem hosting with automatic dev/prod switching",
    category: "infrastructure",
    priority: 1,
  },
  {
    text: "Offline-first development with mock data that mirrors production",
    category: "infrastructure",
    priority: 2,
  },
  {
    text: "Hash-based navigation and routing that works without server configuration",
    category: "infrastructure",
    priority: 7,
  },

  // Developer Experience
  {
    text: "100% type-safe with Zod schema validation and TypeScript coverage",
    category: "developer-experience",
    priority: 3,
  },
  {
    text: "Simplified data loading and submission with automatic error handling",
    category: "developer-experience",
    priority: 4,
  },
  {
    text: "Useful utilities and time-savers for common tasks",
    category: "developer-experience",
    priority: 8,
  },
  {
    text: "Working examples demonstrating real-world patterns",
    category: "developer-experience",
    priority: 9,
  },

  // Production-Ready Features
  {
    text: "Error boundaries prevent entire app crashes",
    category: "production-ready",
    priority: 5,
  },
  {
    text: "Built-in analytics tracking for user journeys",
    category: "production-ready",
    priority: 10,
  },
  {
    text: "Fully customizable components and styling with Tailwind CSS",
    category: "production-ready",
    priority: 11,
  },

  // SharePoint Integration
  {
    text: "SharePoint REST API with request deduplication and cancellation",
    category: "sharepoint",
    priority: 6,
  },
  {
    text: "Handles FormDigest, LookUp columns, and 5000-item threshold automatically",
    category: "sharepoint",
    priority: 12,
  },
];

/** Simple string array for backward compatibility and simple displays */
export const FRAMEWORK_FEATURES_SIMPLE = FRAMEWORK_FEATURES.sort((a, b) => a.priority - b.priority).map((f) => f.text);
