<script lang="ts">
  import { PAGE_UTIL_CLASSES } from "$lib/common-library/utils/const/classes";
  import { cn } from "$lib/utils";
  import { p } from "sv-router/generated";
</script>

<main class={cn("grid prose-sm", PAGE_UTIL_CLASSES.padding, PAGE_UTIL_CLASSES.maxWidth)}>
  <h1>An incomplete guide to the Svelte + SharePoint Starter meta-framework</h1>

  <section>
    <h2>Overview</h2>
    <p>A production-ready meta-framework starter to accelerate and standardize web development projects. Built with Svelte 5, Vite, and TypeScript.</p>
  </section>

  <section>
    <h2>Core Architecture</h2>

    <h3>Routing</h3>
    <p>Uses <a href="https://sv-router.vercel.app/">SV Router</a> for type-safe file-based routing. Generated routes are available in <code>sv-router/generated</code>.</p>

    <h3>Data & Schemas</h3>
    <p>Uses <a href="https://zod.dev/">Zod</a> for schema definition and validation. Store schemas in <code>src/lib/data/schemas.ts</code> and derive types from them for a single source of truth.</p>

    <h3>Types</h3>
    <p>Store your types in <code>src/lib/data/types.ts</code>. Best practice: define Zod schemas first, then extract types using <code>z.infer&lt;typeof Schema&gt;</code>.</p>

    <h3>Environment Configuration</h3>
    <p>
      Store site configuration and environment variables in <code>src/lib/env/env.ts</code>. Store information about your lists and folders here. Most paths are captured automatically, but feel free
      to include other helpful paths.
    </p>
  </section>

  <!-- TODO: Linking to assets -->

  <section>
    <h2>Utilities & Functions</h2>

    <h3>Async State Management</h3>
    <p>Two reactive state classes for handling async operations:</p>
    <ul class="list-disc">
      <li><code>AsyncSubmitState</code> - tracks form submission states (initial, attempted, inProgress, success, error)</li>
      <li><code>AsyncLoadState</code> - tracks data loading states (loading, ready, error)</li>
    </ul>

    <h3>String Utilities</h3>
    <ul class="list-disc">
      <li><code>capitalizeFirstLetter()</code> - capitalize first character</li>
      <li><code>truncate()</code> - truncate string to specified length</li>
      <li><code>removeSpecialCharacters()</code> - strip special characters</li>
      <li><code>removeNewLinesFromString()</code> - normalize line breaks</li>
      <li><code>removeSpecialCharactersAndReplaceSpaceWithHyphen()</code> - create URL-friendly strings</li>
      <li><code>longestString()</code> - find longest string in array</li>
    </ul>

    <h3>Temporal Utilities</h3>
    <ul class="list-disc">
      <li><code>formatDate()</code> - format ISO date strings with short/long options</li>
      <li><code>getHoursMinutesFromMilliSeconds()</code> - convert milliseconds to readable time</li>
      <li>Predefined date formatting options for i18n</li>
    </ul>

    <h3>File Utilities</h3>
    <ul class="list-disc">
      <li><code>fileToArrayBuffer()</code> - convert File to ArrayBuffer</li>
      <li><code>dataUriToFile()</code> - convert base64 data URI to File object</li>
    </ul>

    <h3>Number Utilities</h3>
    <ul class="list-disc">
      <li><code>percentage()</code> - calculate percentage of partial value</li>
    </ul>

    <h3>Object Utilities</h3>
    <ul class="list-disc">
      <li><code>getObjectKeys()</code> - type-safe Object.keys()</li>
      <li><code>getObjectEntries()</code> - type-safe Object.entries()</li>
    </ul>

    <h3>Functional Utilities</h3>
    <ul class="list-disc">
      <li><code>debounce()</code> - debounce function execution</li>
      <li><code>convertToState()</code> - convert plain objects to Svelte reactive state</li>
    </ul>
  </section>

  <section>
    <h2>SharePoint Integration</h2>
    <h3>REST API Operations</h3>
    <ul class="list-disc">
      <li><code>getListItems()</code> - fetch list items with filtering/expansion</li>
      <li><code>getCurrentUser()</code> - get current user information</li>
      <li><code>getCurrentUserProperties()</code> - fetch detailed user properties</li>
      <li>Post/Update/Delete operations available in dedicated modules</li>
    </ul>

    <h3>Utilities</h3>
    <ul class="list-disc">
      <li><code>createSelectExapandQueries()</code> - build OData select/expand syntax</li>
      <li><code>getPictureUrl()</code> - get user profile picture URL</li>
      <li><code>getUserFirstLastNames()</code> - parse SharePoint user names</li>
      <li><code>poll()</code> - polling with retry logic</li>
    </ul>

    <h3>Configuration</h3>
    <p>Define schemas for SharePoint fields in <code>src/lib/common-library/sharepoint-rest-api/schemas.ts</code>. Includes default props, lookup fields, and custom field schemas.</p>
  </section>

  <section>
    <h2>Analytics</h2>
    <p>Built-in analytics tracking with:</p>
    <ul class="list-disc">
      <li><code>AnalyticsEntry</code> schema for tracking events</li>
      <li>Key-value object serialization helpers</li>
    </ul>
  </section>

  <section>
    <h2>Components & UI</h2>

    <h3>Component Library</h3>
    <p>Located in <code>src/lib/common-library/components/</code>, includes:</p>
    <ul class="list-disc">
      <li><strong>Carousel</strong> - image/content carousel with Embla</li>
      <li><strong>Cropper</strong> - image cropping component</li>
      <li><strong>Rich Text Editor</strong> - Tiptap-based WYSIWYG with Markdown support</li>
      <li><strong>File Components</strong> - file upload/handling utilities</li>
      <li><strong>Filters</strong> - data filtering UI components</li>
      <li><strong>Form Components</strong> - Superforms-based form handling</li>
      <li><strong>UI Utilities</strong> - helper components and layouts</li>
    </ul>

    <h3>UI Framework</h3>
    <p>
      Built with <a href="https://www.tailwindcss.com/">Tailwind CSS</a>, <a href="https://bits-ui.com/">Bits UI</a>, and <a href="https://layerchart.com/">LayerChart</a> for styling and components.
    </p>
  </section>

  <section>
    <h2>Rich Text Editing</h2>
    <p>Powered by <a href="https://tiptap.dev/">Tiptap</a> with extensive extensions:</p>
    <ul class="list-disc">
      <li>Code blocks with syntax highlighting (lowlight)</li>
      <li>Tables, lists, and text formatting</li>
      <li>Mathematics support (KaTeX)</li>
      <li>Image insertion and manipulation</li>
      <li>Markdown import/export</li>
      <li>Bubble menu and customizable toolbar</li>
    </ul>
  </section>

  <section>
    <h2>Progressive Web App (PWA)</h2>
    <p>PWA support included with:</p>
    <ul class="list-disc">
      <li>Manifest generation in <code>src/lib/common-library/pwa/manifest.ts</code></li>
      <li>PWA install component for supported browsers</li>
      <li>Head configuration helper</li>
    </ul>
  </section>

  <section>
    <h2>Router Helpers</h2>
    <p>Navigation state tracking with <code>navigating</code> reactive state. Use for loading indicators during route transitions.</p>
  </section>

  <section>
    <h2>Forms & Validation</h2>
    <p>Form handling powered by <a href="https://superforms.rocks/">Superforms</a> with Zod validation integration. Use for robust client and server-side validation.</p>
  </section>

  <section>
    <h2>Data Management</h2>

    <h3>Local Data</h3>
    <p>Mock data available in <code>src/lib/data/local-data.ts</code> for development and testing. Includes sample stories, users, files, and engagements.</p>

    <h3>Global State</h3>
    <p>Centralized reactive state in <code>src/lib/data/global-state.svelte.ts</code> using Svelte 5 runes.</p>
  </section>

  <section>
    <h2>Styling & Theme</h2>
    <ul class="list-disc">
      <li>Tailwind CSS 4 with plugins (forms, typography)</li>
      <li>Dark mode support via <code>mode-watcher</code></li>
      <li>Custom gradient definitions in <code>src/lib/common-library/css/</code></li>
      <li>Utility classes in <code>src/lib/common-library/const/classes.ts</code></li>
    </ul>
  </section>

  <section>
    <h2>Development Tools</h2>
    <ul class="list-disc">
      <li>Type checking: <code>pnpm run check</code></li>
      <li>Route generation: <code>pnpm run gen-routes</code></li>
      <li>Dev server: <code>pnpm run dev</code></li>
      <li>Build: <code>pnpm run build</code></li>
      <li>Preview: <code>pnpm run preview</code></li>
    </ul>
  </section>

  <section>
    <h2>Examples</h2>
    <ul class="list-disc">
      <li><a href={p("/")}>Carousel Implementation</a></li>
      <li><a href={p("/stories")}>Stories with Rich Text Editor</a></li>
      <li><a href={p("/admin")}>Admin Dashboard</a></li>
    </ul>
  </section>
</main>
