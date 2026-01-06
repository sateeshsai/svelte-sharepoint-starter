import type { AsyncLoadState } from "$lib/common-library/utils/async/async.svelte";
import YAML from "js-yaml";
import { marked } from "marked";

export interface DocSection {
  id: string;
  label: string;
  description: string;
  keywords: string[];
  filename: string;
}

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

async function getDocIndex(): Promise<string[]> {
  try {
    const response = await fetch("./assets/docs/index.md");
    if (!response.ok) return [];

    const markdown = await response.text();
    const metadata = await extractFrontmatter(markdown);

    return metadata.files || [];
  } catch (error) {
    console.error("Failed to load docs index:", error);
    return [];
  }
}

export async function getDocs(docsloadState: AsyncLoadState): Promise<DocSection[] | undefined> {
  try {
    // Get list of documentation files from index
    const docFiles = await getDocIndex();

    if (docFiles.length === 0) {
      const errorMessage = "No documentation files found in index";
      docsloadState.setError(errorMessage);
      return;
    }

    // Fetch each doc and extract metadata
    const docs = await Promise.all(
      docFiles.map(async (filename): Promise<DocSection | undefined> => {
        try {
          const response = await fetch(`./assets/docs/${filename}.md`);
          if (!response.ok) {
            docsloadState.appendError(`Failed to fetch doc ${filename}. `);
            return;
          }

          const markdown = await response.text();
          const metadata = await extractFrontmatter(markdown);

          if (!metadata.id) {
            docsloadState.appendError(`Failed to load doc ${filename}. No metadata Id found. `);
            return;
          }

          return {
            id: metadata.id,
            label: metadata.label,
            description: metadata.description,
            keywords: metadata.keywords || [],
            filename: filename,
          };
        } catch (error) {
          docsloadState.appendError(`Catch: Failed to load doc ${filename}:` + error);
          return;
        }
      })
    );

    const filteredDocs = docs.filter((doc): doc is DocSection => doc !== null);
    docsloadState.setReady();
    return filteredDocs;
  } catch (error) {
    docsloadState.appendError(`Catch outer: Failed to load docs:` + error);
    return;
  }
}

/**
 * Renders a documentation section to HTML
 * Fetches the markdown file and converts to HTML, removing frontmatter
 *
 * @param section - The DocSection to render
 * @param loadState - AsyncLoadState instance to manage loading/error states
 * @returns Rendered HTML content, or undefined on error
 */
export async function renderDocSection(section: DocSection, loadState: AsyncLoadState): Promise<string | undefined> {
  try {
    const response = await fetch(`./assets/docs/${section.filename}.md`);
    if (!response.ok) {
      loadState.setError(`Failed to fetch documentation file: ${section.filename}`);
      return;
    }

    const markdown = await response.text();
    // Remove frontmatter
    const content = markdown.replace(/^---\n[\s\S]*?\n---\n/, "");
    const htmlContent = await marked(content);
    loadState.setReady();

    return htmlContent;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    loadState.setError(`Failed to load documentation: ${errorMessage}`);
    return;
  }
}
