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
 */
export async function getMarkdownStories(): Promise<StoryMarkdown[]> {
  try {
    // Fetch the stories index
    const indexResponse = await fetch("./assets/StoryFiles/markdown/stories.md");
    const indexContent = await indexResponse.text();

    // Parse story slugs from the index (each line starting with -)
    const slugs = indexContent
      .split("\n")
      .filter((line) => line.trim().startsWith("-"))
      .map((line) => line.replace(/^-\s*/, "").trim())
      .filter(Boolean);

    // Fetch each story
    const stories = await Promise.all(
      slugs.map(async (slug): Promise<StoryMarkdown> => {
        const response = await fetch(`./assets/StoryFiles/markdown/${slug}.md`);
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

    return stories;
  } catch (error) {
    console.error("Failed to load stories:", error);
    return [];
  }
}

/**
 * Gets a single markdown story by slug.
 * @param slug - URL-safe identifier (filename without .md)
 */
export async function getMarkdownStory(slug: string): Promise<StoryMarkdown | null> {
  const stories = await getMarkdownStories();
  return stories.find((s) => s.slug === slug) || null;
}
