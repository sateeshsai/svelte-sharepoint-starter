# Instructions for agents:

About the project:This is a Svelte 5 (runes only) starter code base with examples and utilities to be used by other developers in the team, to accelerate development and increase collaboration.

# About the codebase:

The build files will be hosted on SharePoint 2013 folders. We use mock data when in dev mode because we can’t connect to SharePoint Rest API on localhost, using providers. The mock and SharePoint API are in sync and should continue to to be in sync (Sharepoint returns get and post responses slightly differently. Fields like Id, Created, Modified, Author are set by SharePoint but and we don't include them in post). Keep meaningful separations between layers like application and common-library etc. Use the functions in the utils folders, only create new ones if required. Refactor and reorganise these when necessary. Don't worry about about breaking changes or backwards compatibity at this point - No need for deprecating unused stuff, if something isn't needed anymore, remove it. $lib/components/ is reserved for third-party UI components. No need to worry about refactoring third party stuff.
Library isolation:
common-library must NOT import from app layer ($lib/data/, $lib/env/, $routes/, etc.). When common-library components need app-specific behavior, use context injection pattern: define context key/types in common-library, app layer sets the context (in App.svelte), components get from context with fallback to base implementation. See ASYNC_STATE_CONTEXT_KEY in utils/async/ and initAsyncStateContext() in $lib/data/async-state.svelte.ts for the pattern. Also see ENGAGEMENT_CONTEXT_KEY and initEngagementContext() for engagements.

Data Provider Pattern:
All data operations (GET/POST/UPDATE/DELETE) must go through `getDataProvider()` from `$lib/data/data-providers/provider-factory.ts`. Never call REST functions directly from app-layer code. The provider abstracts between MockDataProvider (LOCAL_MODE) and SharePointDataProvider (production). Provider method signatures and return types must stay in sync across: DataProvider interface, SharePointDataProvider, and BaseMockDataProvider. REST functions in common-library should not import from app layer - config is passed via provider constructor.

Important: `getContext()` can ONLY be called during component initialization, NOT inside async callbacks or event handlers. If you need context values in async code, capture them at component init time or pass as parameters.

# Standards:

Variable names should be succinct, meaningful, unambiguous. Maintainability and ease of use is important. Always use correct semantic html, thinking of the larger context. Pay attention of data loading and submission patterns. We use Shad-Cn svelte components in components/ui. Use them where appropriate but don't force fit. Network requests fetching and submitting page’s data should be at the top most route which uses that data in respective post.ts or get.ts functions. Always validate submissions inside the component using the post variant of an item schema before posting to lists. We don’t validate incoming data. Big pieces of constant data should be next to the user component as data.ts.
Naming conventions for data layer (`$lib/data/items/`):

- Types: `Xxx_ListItem` (GET data), `Xxx_PostItem` (POST data)
- Schemas: `Xxx_Schema` (core), `Xxx_ListItem_Schema` (GET), `Xxx_PostItem_Schema` (POST)
- Factory functions: `createXxxListItem`, `createXxxPostItem`, `xxxListItemToPostItem`
- Domain modules should be self-contained. Cross-domain schemas (e.g., `File_PostItem_ForStory_Schema`) live in the consumer's module (stories/) not the source (files/).
  Important:
  Assume we are in LOCAL_MODE. Get a solid understanding of the code base. Pay attention to detail, recheck understanding by reviewing files on how things connect with each other instead of assuming. Provide subjective ones, if any, in a separate section, don't nitpick too much though. Run pnpm check to verify when it makes sense to do so. Always be concise and focus on important details than grammar. Ask clarifying questions, only if needed.

# Quirks

Tailwind Typography's prose-sm sets max-width at sm: breakpoint, so Section's max-width classes need matching sm: variants to win specificity.

# Comment plan:

JS Doc Comments should be meaningful, concise, and more importantly helpful to the developers using the code base. Okay to have more detailed info library code, if it’s helpful. Comments should be about our specific implementations and patterns, than something the user can look up online.

# Overall goal:

Overall we are trying to refactor the codebase to make it more robust, with more features, finding bugs and edge cases. For now let’s focus on solving a specific task.

# How we’ll collaborate:

Describe unusual terminal expand if and when they are proposed.

# Things to do at the beginning to each task:

Create a new branch with a short but descriptive name for the task.

# Things to do after full completion of the task i.e, when we close the session:

- Run pnpm check.
- Update/add JSDoc comments and the .md docs (the ones in the public folder) if necessary. No need for additional section level docs.
- Update this agents.md file with information that you now know that would have been helpful if included/elaborated/clarified in this file.
- Update FRAMEWORK_FEATURES with any new things we added that should be listed in it.
- Finally commit changes, merge with main branch and push to origin. Commit messages brief and glanceable.
