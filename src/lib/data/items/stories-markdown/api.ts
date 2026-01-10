/**
 * Markdown Stories API
 *
 * Loads stories from markdown files in /public/assets/StoryFiles/markdown/.
 * This is a demo feature showing how to render markdown-based content.
 *
 * @example
 * import { getMarkdownStories, getMarkdownStory, type StoryMarkdown } from "$lib/data/items/stories-markdown";
 */

import type { Story_ListItem } from "$lib/data/items/stories/schemas";
import type { File_ListItem } from "$lib/data/items/files/schemas";
import type { BaseAsyncLoadState } from "$lib/common-library/utils/async/async.svelte";
import { apiError, notFoundError } from "$lib/common-library/integrations/error-handling";
import YAML from "js-yaml";
import { marked } from "marked";

/**
 * Extended story type for markdown-based stories.
 * Includes slug for URL routing and pre-rendered HTML content.
 */
export type StoryMarkdown = Story_ListItem & {
  /** URL-safe identifier derived from filename */
  slug: string;
  /** Pre-rendered HTML from markdown content */
  htmlContent: string;
  /** Optional attached files */
  Files?: File_ListItem[];
};

/** Parses YAML frontmatter from markdown file. */
async function extractFrontmatter(markdown: string): Promise<Record<string, any>> {
  const match = markdown.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  try {
    return YAML.load(match[1]) as Record<string, any>;
  } catch (e) {
    console.error("Failed to parse frontmatter:", e);
    return {};
  }
}

/** Strips YAML frontmatter from markdown content. */
function extractContent(markdown: string): string {
  return markdown.replace(/^---\n[\s\S]*?\n---\n/, "");
}

/**
 * Loads all stories from markdown files in /public/assets/StoryFiles/markdown/.
 * Reads stories.md index file to discover story slugs, then fetches and parses each markdown file.
 * @param storiesLoadState - State object to track loading/error status
 */
export async function getMarkdownStories(storiesLoadState: BaseAsyncLoadState): Promise<StoryMarkdown[] | undefined> {
  // Fetch the stories index
  const indexResponse = await fetch("./assets/StoryFiles/markdown/stories.md");
  if (!indexResponse.ok) {
    storiesLoadState.setError(apiError({ userMessage: "Could not fetch stories index", technicalMessage: `HTTP ${indexResponse.status}`, context: "getMarkdownStories" }));
    return undefined;
  }
  const indexContent = await indexResponse.text();

  // Parse story slugs from the index (each line starting with -)
  const slugs = indexContent
    .split("\n")
    .filter((line) => line.trim().startsWith("-"))
    .map((line) => line.replace(/^-\s*/, "").trim())
    .filter(Boolean);

  // Fetch each story
  const storyResults = await Promise.all(
    slugs.map(async (slug): Promise<StoryMarkdown | null> => {
      const response = await fetch(`./assets/StoryFiles/markdown/${slug}.md`);
      if (!response.ok) {
        console.error(`Failed to fetch markdown story: ${slug}`);
        return null;
      }
      const markdown = await response.text();

      const metadata = await extractFrontmatter(markdown);
      const content = extractContent(markdown);
      const htmlContent = await marked(content);

      return {
        slug,
        htmlContent,
        Id: Math.random(),
        Title: metadata.Title || slug,
        Content: content,
        Tags: metadata.Tags || "",
        Introduction: metadata.Introduction || "",
        CoverFileName: metadata.CoverFileName || "",
        ActiveStatus: "Active" as const,
        PublishStatus: "Published" as const,
        Created: new Date().toISOString(),
        Modified: new Date().toISOString(),
        Author: { Id: 0, Title: "Markdown Author" },
        Files: metadata.Files || [],
      };
    })
  );

  // Filter out failed fetches
  const stories = storyResults.filter((s): s is StoryMarkdown => s !== null);
  storiesLoadState.setReady();
  return stories;
}

/**
 * Gets a single markdown story by slug (fetches directly, not via getMarkdownStories).
 * @param slug - URL-safe identifier (filename without .md)
 * @param storyLoadState - State object to track loading/error status
 */
export async function getMarkdownStory(slug: string, storyLoadState: BaseAsyncLoadState): Promise<StoryMarkdown | undefined> {
  const response = await fetch(`./assets/StoryFiles/markdown/${slug}.md`);
  if (!response.ok) {
    storyLoadState.setError(notFoundError({ userMessage: `Story "${slug}" not found`, context: "getMarkdownStory" }));
    return undefined;
  }

  const markdown = await response.text();
  const metadata = await extractFrontmatter(markdown);
  const content = extractContent(markdown);
  const htmlContent = await marked(content);

  storyLoadState.setReady();
  return {
    slug,
    htmlContent,
    Id: Math.random(),
    Title: metadata.Title || slug,
    Content: content,
    Tags: metadata.Tags || "",
    Introduction: metadata.Introduction || "",
    CoverFileName: metadata.CoverFileName || "",
    ActiveStatus: "Active" as const,
    PublishStatus: "Published" as const,
    Created: new Date().toISOString(),
    Modified: new Date().toISOString(),
    Author: { Id: 0, Title: "Markdown Author" },
    Files: metadata.Files || [],
  };
}
